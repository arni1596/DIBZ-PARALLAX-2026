import {samplePixel} from './model.ts';
import type {Observation,ObservationData,Sample} from './model.ts';

export interface InspectionIdentity {observationId:string;x:number;y:number}
/** Interaction identity only. Scientific state stays in the selected observation and sample. */
export function inspectionMatches(action:InspectionIdentity|null,observationId:string,pixel:{x:number;y:number}){
 return action!==null&&action.observationId===observationId&&action.x===pixel.x&&action.y===pixel.y;
}
export function explainPixel(sample:Sample){
 const reasons:string[]=[];
 if(sample.rawValue===null)reasons.push('IMAGE is missing or nonfinite; no brightness value is available here.');
 if(sample.variance===null)reasons.push('VARIANCE is missing or nonfinite; a usable statistical uncertainty is unavailable.');
 else if(sample.variance<=0)reasons.push('VARIANCE is nonpositive. This is not a zero-error measurement.');
 const excluding=sample.flagNames.filter(name=>name!=='SOURCE');
 if(excluding.length)reasons.push('Quality flags: '+excluding.join(', ')+'. These exclude this pixel under the current conservative policy.');
 if(!sample.accepted&&reasons.length===0)reasons.push('The recorded quality mask excludes this pixel; no more specific exclusion reason is resolved.');
 return {
  title:sample.accepted?'This pixel passes the current quality checks.':'This pixel does not pass the current quality checks.',
  display:sample.accepted?'The preview shows a contrast-stretched view of this recorded value.':sample.rawValue===null?'The black or amber area marks missing or excluded data, not a measured dark object.':'A finite IMAGE value is stored here, but the quality-masked preview excludes it.',
  reasons,
  permission:sample.accepted?'Inspect the supplied value and per-pixel statistical uncertainty. This is not validated source photometry.':'Use this sample to inspect data quality. It cannot support a brightness estimate under the current policy.',
  sourceNote:sample.flagNames.includes('SOURCE')?'SOURCE is descriptive and is not an exclusion under this policy.':null
 };
}
/** Select an actual excluded pixel within the documented native core, nearest its WCS position. */
export function flaggedCorePixel(o:Observation,d:ObservationData){
 const [height,width]=o.dimensions,[cx,cy]=o.wcs.targetPixel,r=o.quality.sourceCore.radiusPixels;
 let best:{x:number;y:number}|null=null,distance=Infinity;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const rr=(x-cx)**2+(y-cy)**2;
  if(rr<=r*r&&rr<distance&&!samplePixel(o,d,x,y).accepted){best={x,y};distance=rr;}
 }
 return best;
}

/** Prefer a recorded reference, but validate it against the active native buffers. */
export function usableReferencePixel(o:Observation,d:ObservationData){
 for(const p of o.referencePixels)if(samplePixel(o,d,p.x,p.y).accepted)return {x:p.x,y:p.y};
 const [height,width]=o.dimensions;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(samplePixel(o,d,x,y).accepted)return {x,y};
 return null;
}
