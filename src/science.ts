import type {Bundle,Plane,Selection,Science,Sample,Pair} from './types.ts';
export const KNOWN=(1<<1)|(1<<19)|(1<<21);
/** Stored ICRS values are normalized; only calculated TAN output is wrapped. */
export function validSkyCoordinate(ra:number,dec:number){return Number.isFinite(ra)&&ra>=0&&ra<360&&Number.isFinite(dec)&&dec>=-90&&dec<=90;}
function validateTan(h:Record<string,string|number>){
 if(!['CRPIX1','CRPIX2','CRVAL1','CRVAL2','CDELT1','CDELT2'].every(k=>typeof h[k]==='number'&&Number.isFinite(h[k]))||!validSkyCoordinate(h.CRVAL1 as number,h.CRVAL2 as number)||h.CDELT1===0||h.CDELT2===0||['PC1_1','PC1_2','PC2_1','PC2_2'].some(k=>h[k]!==undefined&&(typeof h[k]!=='number'||!Number.isFinite(h[k]))))throw Error('Invalid celestial TAN WCS metadata');
}
export function classifyPixel(image:number,hits:number,flags:number):'eligible'|'missing'|'quality-rejected'{
 if(!Number.isFinite(image)||!Number.isFinite(hits)||hits<=0)return 'missing';
 return (flags&((1<<1)|(1<<19)))!==0||(flags&~KNOWN)!==0?'quality-rejected':'eligible';
}
export function summarize(p:Plane,indices:readonly number[]):Sample{
 let finite=0,hits=0,intersection=0,eligible=0,missing=0,rejected=0,source=0,overflow=0,outlier=0,unknown=0,sum=0,min=Infinity,max=-Infinity;
 for(const i of indices){const v=p.image[i],h=p.hits[i],f=p.flags[i];if(Number.isFinite(v))finite++;if(h>0)hits++;if(Number.isFinite(v)&&h>0)intersection++;if(f&(1<<21))source++;if(f&(1<<1))overflow++;if(f&(1<<19))outlier++;if(f&~KNOWN)unknown++;min=Math.min(min,h);max=Math.max(max,h);const kind=classifyPixel(v,h,f);if((p.mask[i]!==0)!==(kind==='eligible'))throw Error('Numerical visualization mask disagrees with flags/hits.');if(kind==='eligible'){sum+=v;eligible++}else if(kind==='missing')missing++;else rejected++}
 return {value:eligible?sum/eligible:null,total:indices.length,finite,hits,intersection,eligible,missing,rejected,source,overflow,outlier,unknown,hitMin:indices.length?min:null,hitMax:indices.length?max:null,availability:!indices.length?'OUTSIDE_FRAME':eligible===0?'UNAVAILABLE':eligible===indices.length?'COMPLETE':'PARTIAL'};
}
export function pixelToSky(x:number,y:number,h:Record<string,string|number>):[number,number]{
 if(!Number.isFinite(x)||!Number.isFinite(y))throw Error('Nonfinite native pixel coordinate');validateTan(h);
 const rad=Math.PI/180;const dx=x+1-Number(h.CRPIX1),dy=y+1-Number(h.CRPIX2);
 const xi=(Number(h.PC1_1??1)*dx+Number(h.PC1_2??0)*dy)*Number(h.CDELT1)*rad;
 const eta=(Number(h.PC2_1??0)*dx+Number(h.PC2_2??1)*dy)*Number(h.CDELT2)*rad;
 const a=Number(h.CRVAL1)*rad,d=Number(h.CRVAL2)*rad;
 const ra=a+Math.atan2(xi,Math.cos(d)-eta*Math.sin(d));
 const dec=Math.atan2(Math.sin(d)+eta*Math.cos(d),Math.hypot(Math.cos(d)-eta*Math.sin(d),xi));
 return [((ra/rad)%360+360)%360,dec/rad];
}
export function separationArcsec(a:[number,number],b:[number,number]){if(!validSkyCoordinate(...a)||!validSkyCoordinate(...b))throw Error('Invalid ICRS coordinate');const r=Math.PI/180;const q=Math.sin((a[1]-b[1])*r/2)**2+Math.cos(a[1]*r)*Math.cos(b[1]*r)*Math.sin((a[0]-b[0])*r/2)**2;return 2*Math.asin(Math.sqrt(Math.max(0,Math.min(1,q))))/r*3600}
const regionCache=new Map<string,number[]>();
export function regionIndices(s:Selection,science:Science):number[]{
 const [height,width]=science.spatial.shape_yx;
 if(s.kind==='pixel'){if(!Number.isInteger(s.x)||!Number.isInteger(s.y)||s.x<0||s.y<0||s.x>=width||s.y>=height)throw Error('Selected pixel outside original grid');return [s.y*width+s.x]}
 const key=JSON.stringify([s,science.spatial]);const cached=regionCache.get(key);if(cached)return cached;
 const list:number[]=[];const spec=science.regions.find(r=>r.id===s.kind);
 if(!spec&&s.kind!=='disk'&&s.kind!=='full_frame')throw Error('Unknown reference region');
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  let included=s.kind==='full_frame';
  if(s.kind==='disk')included=(x-s.x)**2+(y-s.y)**2<=s.radius**2;
  else if(s.kind==='target_pixel')included=x===science.spatial.target_selected_xy[0]&&y===science.spatial.target_selected_xy[1];
  else if(spec?.outer_radius_arcsec!=null){const distance=separationArcsec(pixelToSky(x,y,science.spatial.wcs_header),science.spatial.target_reference_ra_dec_deg);included=distance>=Number(spec.inner_radius_arcsec??0)&&distance<=spec.outer_radius_arcsec}
  if(included)list.push(y*width+x);
 }
 if(regionCache.size>16)regionCache.delete(regionCache.keys().next().value!);regionCache.set(key,list);return list;
}
export function comparisonAllowed(pair:Pair){return pair.comparison_enabled===true&&pair.spectral_compatibility_validated===true&&pair.registration_quality_validated===true}
export function validateContracts(d:Bundle){
 validateTan(d.science.spatial.wcs_header);
 if(d.science.image_units.replaceAll(' ','')!=='MJy/sr'||!d.science.spatial.shape_yx.every(n=>Number.isInteger(n)&&n>0)||!validSkyCoordinate(...d.science.spatial.target_reference_ra_dec_deg))throw Error('Invalid mosaic geometry or units');
 if(!d.report.dataset_ready_for_exploratory_interface||d.verification.status!=='PASS'||d.report.failures.length)throw Error('Dataset readiness failed. Stale assets are blocked.');
 const ids=new Set(d.channels.map(c=>c.global_channel));if(d.channels.length!==102||ids.size!==102||[...ids].some(n=>n<1||n>102))throw Error('Expected exactly 102 official channels');
 if(d.coverage.channels.length!==102||d.manifest.channels.length!==102)throw Error('Contract channel count mismatch');
 for(const rows of [d.channels,d.coverage.channels,d.manifest.channels]){if(new Set(rows.map(c=>c.global_channel)).size!==102||new Set(rows.map(c=>c.plane_index_zero_based)).size!==102||rows.some(c=>!Number.isInteger(c.global_channel)||!Number.isInteger(c.plane_index_zero_based)||c.plane_index_zero_based<0||c.plane_index_zero_based>=102||!Number.isFinite(c.wavelength_um)||c.wavelength_um<=0))throw Error('Invalid mosaic channel or plane identity');}
 for(const c of d.channels){if(![c.bandwidth_um,c.wl_min_um,c.wl_max_um].every(n=>Number.isFinite(n)&&n>0)||c.wl_min_um>=c.wl_max_um||c.wavelength_um<c.wl_min_um||c.wavelength_um>c.wl_max_um||c.fits_plane_one_based!==c.plane_index_zero_based+1||c.source_reference.extension!=='IMAGE'||c.source_reference.channel_table_extension!=='SPECTRAL_CHANNELS')throw Error('Invalid mosaic spectral metadata');}
 for(const c of d.channels){const m=d.manifest.channels.find(e=>e.global_channel===c.global_channel),v=d.coverage.channels.find(e=>e.global_channel===c.global_channel);if(!m||!v)throw Error('Channel identity missing');if(c.wavelength_um!==m.wavelength_um||c.wavelength_um!==v.wavelength_um)throw Error('Channel wavelength mismatch');if(c.plane_index_zero_based!==m.plane_index_zero_based||c.plane_index_zero_based!==v.plane_index_zero_based)throw Error('Physical plane mismatch');if(c.image_path!==(m.image?.path??null))throw Error('Image path mismatch');if(c.source_reference.cube_sha256!==d.science.cube.sha256||m.source_reference.cube_sha256!==d.science.cube.sha256)throw Error('Cube source identity mismatch');if(c.science_measurement_suitability_established||c.calibration_provenance_status!=='UNVERIFIED')throw Error('Unsupported science status');}
 if(d.dated.pairs.length!==55||d.dated.pairs.some(p=>p.comparison_enabled)||d.dated.enabled_pair_count!==0)throw Error('Unexpected comparison eligibility; this viewer must preserve all 55 disabled pairs');
 if(d.science.spatial.wcs_header.CTYPE1!=='RA---TAN'||d.science.spatial.wcs_header.CTYPE2!=='DEC--TAN')throw Error('Unsupported sky projection');
}

export function outsideFramePixels(s:Selection,width:number,height:number):number{
 if(s.kind!=='disk')return 0;let count=0;for(let dy=-s.radius;dy<=s.radius;dy++)for(let dx=-s.radius;dx<=s.radius;dx++)if(dx*dx+dy*dy<=s.radius*s.radius&&(s.x+dx<0||s.x+dx>=width||s.y+dy<0||s.y+dy>=height))count++;return count;
}
export function withFrameExtent<T extends {availability:Sample['availability'];eligible:number}>(sample:T,outside:number):T&{outside:number}{return {...sample,outside,availability:outside>0&&sample.eligible>0?'PARTIAL':sample.availability}}
