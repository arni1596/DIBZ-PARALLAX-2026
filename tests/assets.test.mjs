import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';import {inflateSync} from 'node:zlib';
import {classifyPixel} from '../src/science.ts';import {VERIFICATION_SHA256} from '../src/data.ts';
const root=new URL('../public/dataset/',import.meta.url),read=n=>fs.readFileSync(new URL(n,root)),json=n=>JSON.parse(read(n));
const hash=b=>createHash('sha256').update(b).digest('hex');
function png(bytes,width,height){let pos=8,chunks=[];while(pos<bytes.length){const n=bytes.readUInt32BE(pos);if(bytes.toString('ascii',pos+4,pos+8)==='IDAT')chunks.push(bytes.subarray(pos+8,pos+8+n));pos+=n+12}const raw=inflateSync(Buffer.concat(chunks));assert.equal(raw.length,height*(width*2+1));return raw}
const even=n=>{const floor=Math.floor(n),fraction=n-floor;return fraction===.5?(floor%2?floor+1:floor):Math.round(n)};
test('pinned verification and all 532 existing dataset artifact hashes are unchanged',()=>{assert.equal(hash(read('verification_results.json')),VERIFICATION_SHA256);for(const [path,expected] of Object.entries(json('verification_results.json').artifact_sha256))assert.equal(hash(read(path)),expected,path)});
test('all 102 real PNGs agree with numerical IMAGE, hit/flag eligibility, and declared plane identity',()=>{
 const d=json('image_manifest.json'),channels=json('channels_102.json').channels;
 for(const e of d.channels){const ch=channels.find(c=>c.global_channel===e.global_channel);assert.equal(ch.plane_index_zero_based,e.plane_index_zero_based);assert.equal(ch.wavelength_um,e.wavelength_um);
 const image=read(e.numerical.IMAGE.path),hits=read(e.numerical.NHITS.path),flags=read(e.numerical.FLAGS.path),mask=read(e.numerical.VISUALIZATION_MASK.path);const [height,width]=e.numerical.IMAGE.shape;
 const pngBytes=read(e.image.path);assert.equal(hash(pngBytes),e.image.sha256);const raw=png(pngBytes,width,height);
 for(let y=0;y<height;y++){const row=(height-1-y)*(width*2+1);assert.equal(raw[row],0);for(let x=0;x<width;x++){const i=y*width+x,v=image.readFloatLE(i*4),eligible=classifyPixel(v,hits.readInt32LE(i*4),flags.readInt32LE(i*4))==='eligible';assert.equal(mask[i]!==0,eligible);assert.equal(raw[row+1+x*2+1],eligible?255:0);const display=Number.isFinite(v)?v:d.display.low;const gray=even(255*Math.max(0,Math.min(1,(display-d.display.low)/(d.display.high-d.display.low))));assert.equal(raw[row+1+x*2],gray)}}
 }
});
