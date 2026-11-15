import type {Bundle,Entry,Plane,ProfilePoint,Asset} from './types.ts';
import {summarize,validateContracts,withFrameExtent} from './science.ts';
export const VERIFICATION_SHA256='15acc5fd8a06dc98b4572dbd74e5f06ea6893a98ac8f93e46c8f19683f44e3c0';
export async function hash(bytes:ArrayBuffer){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('')}
function safePath(path:string){if(path.startsWith('/')||path.includes('..')||!/^[-\w./]+$/.test(path))throw Error('Unsafe dataset asset path');return path}
async function bytes(path:string,expected:string){const response=await fetch('/dataset/'+safePath(path));if(!response.ok)throw Error(`Dataset asset unavailable: ${path} (HTTP ${response.status})`);const b=await response.arrayBuffer();if(await hash(b)!==expected)throw Error(`Integrity check failed: ${path}. No fallback data will be shown.`);return b}
export async function loadDataset():Promise<Bundle>{
 const verification=JSON.parse(new TextDecoder().decode(await bytes('verification_results.json',VERIFICATION_SHA256)));
 if(verification.status!=='PASS')throw Error('Dataset acceptance is not PASS');
 const names=['channels_102.json','channel_coverage_102.json','image_manifest.json','science_metadata.json','processing_report.json','dated_exposures.json'];
 const results=await Promise.all(names.map(async path=>{const expected=verification.artifact_sha256[path];if(!expected)throw Error('Missing verified contract hash: '+path);return JSON.parse(new TextDecoder().decode(await bytes(path,expected)))}));
 const d:Bundle={channels:results[0].channels,coverage:results[1],manifest:results[2],science:results[3],report:results[4],dated:results[5],verification};validateContracts(d);return d;
}
const planeCache=new Map<string,Promise<Plane>>();
const retainedPlanes=new Map<string,number>();
export function cacheMetrics(){return {planes:retainedPlanes.size,typedArrayBytes:[...retainedPlanes.values()].reduce((a,b)=>a+b,0)}}
export async function loadPlane(entry:Entry):Promise<Plane>{
 const key=JSON.stringify([entry.global_channel,entry.numerical]);const old=planeCache.get(key);if(old)return old;
 const promise=(async()=>{const keys=['IMAGE','NHITS','FLAGS','VISUALIZATION_MASK'] as const;
 const arrays=await Promise.all(keys.map(async key=>{const m=entry.numerical[key];const b=await bytes(m.path,m.sha256);const count=m.shape[0]*m.shape[1];const size=key==='VISUALIZATION_MASK'?1:4;if(b.byteLength!==m.byte_length||b.byteLength!==count*size)throw Error('Numerical buffer length mismatch: '+m.path);if(m.dtype!==(key==='IMAGE'?'<f4':key==='VISUALIZATION_MASK'?'|u1':'<i4'))throw Error('Numerical dtype mismatch');const v=new DataView(b);if(key==='VISUALIZATION_MASK')return new Uint8Array(b);const a=key==='IMAGE'?new Float32Array(count):new Int32Array(count);for(let i=0;i<count;i++)a[i]=key==='IMAGE'?v.getFloat32(i*4,true):v.getInt32(i*4,true);return a}));
 retainedPlanes.set(key,arrays.reduce((n,a)=>n+a.byteLength,0));
 return {image:arrays[0] as Float32Array,hits:arrays[1] as Int32Array,flags:arrays[2] as Int32Array,mask:arrays[3] as Uint8Array};})();
 planeCache.set(key,promise);// Retain the fixed 102-plane dataset (~94.5 MB); ROI changes reuse verified buffers.
 try{return await promise}catch(e){planeCache.delete(key);throw e}
}
const images=new Map<string,Promise<string>>();
export function loadImage(asset:Asset):Promise<string>{const old=images.get(asset.path);if(old)return old;const promise=bytes(asset.path,asset.sha256).then(b=>{if(b.byteLength!==asset.byte_length)throw Error('Image byte length mismatch');return URL.createObjectURL(new Blob([b],{type:'image/png'}))}).catch(e=>{images.delete(asset.path);throw e});images.set(asset.path,promise);return promise}
export async function loadProfile(d:Bundle,indices:number[],progress:(n:number)=>void,isCancelled:()=>boolean,outside=0):Promise<ProfilePoint[]>{
 const results:ProfilePoint[]=new Array(d.channels.length);let next=0,done=0;
 await Promise.all(Array.from({length:4},async()=>{while(!isCancelled()){const i=next++;if(i>=d.channels.length)return;const channel=d.channels[i];const entry=d.manifest.channels.find(e=>e.global_channel===channel.global_channel)!;const plane=await loadPlane(entry);if(isCancelled())return;results[i]={channel,...withFrameExtent(summarize(plane,indices),outside)};progress(++done)}}));
 return results;
}
