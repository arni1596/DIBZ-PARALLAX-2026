import type {Plane,Selection,Bundle} from './types.ts';
import type {Contrast} from './display.ts';
import {classifyPixel} from './science.ts';
export interface ComparisonState {channelA:number;channelB:number;region:Selection;display:{preset:'asinh'|'linear';intersectionOnly:boolean;smooth:boolean;native?:boolean};view:{zoom:number;pan:{x:number;y:number};layout?:'wipe'|'side';divider?:number;context?:'field'|'region'}}
export interface ComparisonStats {commonCount:number;total:number;coverageFraction:number;meanA:number|null;meanB:number|null;difference:number|null;ratio:number|null;excludedA:number;excludedB:number}
type Metadata=Pick<Bundle,'channels'|'science'|'verification'>;
function eligible(p:Plane,i:number){return p.mask[i]!==0&&classifyPixel(p.image[i],p.hits[i],p.flags[i])==='eligible'}
function checkPlane(p:Plane){if([p.hits,p.flags,p.mask].some(a=>a.length!==p.image.length))throw Error('Mismatched native plane arrays')}
function checkIndices(p:Plane,indices:readonly number[]){for(const i of indices)if(!Number.isInteger(i)||i<0||i>=p.image.length)throw Error('Invalid native pixel index')}
export function sharedContrast(a:Plane,b:Plane,indices?:readonly number[],preset:'asinh'|'linear'='asinh'):Contrast {
 checkPlane(a);checkPlane(b);if(a.image.length!==b.image.length)throw Error('Contrast requires a common native grid');if(indices){checkIndices(a,indices);checkIndices(b,indices)}
 const values:number[]=[];for(const i of indices??a.image.keys())if(eligible(a,i)&&eligible(b,i)){values.push(a.image[i],b.image[i])}
 if(!values.length)return {low:0,high:1,soft:.01};values.sort((x,y)=>x-y);
 const at=(q:number)=>{const k=(values.length-1)*q,l=Math.floor(k);return values[l]+(values[Math.ceil(k)]-values[l])*(k-l)};
 const low=at(.005),high=Math.max(preset==='linear'?at(.995):values[values.length-1],low+Math.max(1e-9,Math.abs(low)*1e-9));return {low,high,soft:Math.max((at(.99)-low)*.12,(high-low)*.0001,1e-9)};
}
/** Means, A-minus-B and A/B all use the same intersection of eligible native pixels. */
export function compareSamples(a:Plane,b:Plane,indices:readonly number[]):ComparisonStats {
 checkPlane(a);checkPlane(b);if(a.image.length!==b.image.length)throw Error('Comparison requires a common native grid');checkIndices(a,indices);checkIndices(b,indices);
 let commonCount=0,sumA=0,sumB=0,excludedA=0,excludedB=0;for(const i of indices){const ea=eligible(a,i),eb=eligible(b,i);if(!ea)excludedA++;if(!eb)excludedB++;if(ea&&eb){commonCount++;sumA+=a.image[i];sumB+=b.image[i]}}
 const meanA=commonCount?sumA/commonCount:null,meanB=commonCount?sumB/commonCount:null;
 return {commonCount,total:indices.length,coverageFraction:indices.length?commonCount/indices.length:0,meanA,meanB,difference:meanA!==null&&meanB!==null?meanA-meanB:null,ratio:meanA!==null&&meanB!==null&&meanB!==0&&Number.isFinite(meanA/meanB)?meanA/meanB:null,excludedA,excludedB};
}
function validateState(s:ComparisonState,d:Metadata){
 const [height,width]=d.science.spatial.shape_yx;
 const keys=(o:object,allowed:string[])=>{if(!o||Object.keys(o).some(k=>!allowed.includes(k)))throw Error('Unsupported state flags')};
 keys(s,['channelA','channelB','region','display','view']);keys(s.region,['kind','x','y','radius']);keys(s.display,['preset','intersectionOnly','smooth','native']);keys(s.view,['zoom','pan','layout','divider','context']);keys(s.view.pan,['x','y']);
 if(!s||![s.channelA,s.channelB].every(id=>Number.isInteger(id)&&d.channels.some(c=>c.global_channel===id)))throw Error('Invalid channel ID');
 if(s.display?.native!==undefined&&typeof s.display.native!=='boolean')throw Error('Invalid sampling flag');
 if(s.view?.layout!==undefined&&!['wipe','side'].includes(s.view.layout))throw Error('Invalid comparison layout');if(s.view?.divider!==undefined&&(!Number.isFinite(s.view.divider)||s.view.divider<0||s.view.divider>100))throw Error('Invalid divider');if(s.view?.context!==undefined&&!['field','region'].includes(s.view.context))throw Error('Invalid crop');
 const r=s.region;if(!r||![r.x,r.y,r.radius].every(Number.isFinite)||!Number.isInteger(r.x)||!Number.isInteger(r.y)||r.x<0||r.y<0||r.x>=width||r.y>=height||!Number.isInteger(r.radius)||r.radius<0||r.radius>Math.max(width,height)||!['pixel','disk','full_frame',...d.science.regions.map(r=>r.id)].includes(r.kind))throw Error('Invalid region coordinates');
 if(!s.display||!['asinh','linear'].includes(s.display.preset)||typeof s.display.intersectionOnly!=='boolean'||typeof s.display.smooth!=='boolean')throw Error('Unsupported display flags');
 if(!s.view||!Number.isFinite(s.view.zoom)||s.view.zoom<1||s.view.zoom>8||!s.view.pan||![s.view.pan.x,s.view.pan.y].every(v=>Number.isFinite(v)&&Math.abs(v)<=100000))throw Error('Invalid view coordinates');
}
function validateStats(s:ComparisonStats){if(!s||![s.commonCount,s.total,s.excludedA,s.excludedB].every(v=>Number.isInteger(v)&&v>=0)||s.commonCount>s.total||s.excludedA>s.total||s.excludedB>s.total||s.coverageFraction!==(s.total?s.commonCount/s.total:0)||![s.meanA,s.meanB,s.difference,s.ratio].every(v=>v===null||Number.isFinite(v)))throw Error('Invalid measured statistics')}
export function buildRecord(state:ComparisonState,d:Metadata,stats:ComparisonStats){
 if(d.verification.status!=='PASS')throw Error('Verified metadata required');validateState(state,d);validateStats(stats);
 return {schemaVersion:1 as const,exploratory:true as const,noScientificConclusion:true as const,state:structuredClone(state),channels:[state.channelA,state.channelB].map(id=>{const c=d.channels.find(c=>c.global_channel===id)!;return {global_channel:c.global_channel,wavelength_um:c.wavelength_um,source_reference:structuredClone(c.source_reference)}}),nativeGrid:structuredClone(d.science.spatial.shape_yx),imageUnits:d.science.image_units,statistics:structuredClone(stats),statisticSupport:'intersection of eligible native pixels' as const,sourceCitation:{cubeSha256:d.science.cube.sha256,url:d.science.cube.candidate_documented_origin.url},limitations:[...d.science.cube.limitations,...d.science.limitations,'Exploratory within-cube wavelength comparison; no scientific conclusion or calibrated spectral inference is established.']};
}
export type ComparisonRecord=ReturnType<typeof buildRecord>;
export function encodeRecord(record:ComparisonRecord):string {return '#compare='+encodeURIComponent(JSON.stringify(record))}
/** Metadata is required so channel identities and source provenance cannot be supplied by a share link. */
export function decodeRecord(fragment:string,d:Metadata):ComparisonRecord {
 if(!fragment.startsWith('#compare=')||fragment.length>100000)throw Error('Unsupported share fragment');let r:ComparisonRecord;try{r=JSON.parse(decodeURIComponent(fragment.slice(9)))}catch{throw Error('Invalid share record')}
 if(r.schemaVersion!==1||r.exploratory!==true||r.noScientificConclusion!==true)throw Error('Unsupported share flags');
 const rebuilt=buildRecord(r.state,d,r.statistics);if(JSON.stringify(r)!==JSON.stringify(rebuilt))throw Error('Share metadata or flags differ from verified record');return rebuilt;
}

