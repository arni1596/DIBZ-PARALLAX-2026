import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {loadImage,loadPlane} from '../src/data.ts';
const root=new URL('../public/dataset/',import.meta.url),manifest=JSON.parse(fs.readFileSync(new URL('image_manifest.json',root),'utf8'));
test('corrupt image bytes fail integrity without a fabricated fallback',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>new Response(new Uint8Array([1,2,3]));
 try{await assert.rejects(loadImage({path:'assets/test-corrupt.png',sha256:'0'.repeat(64),byte_length:3}),/Integrity check failed/)}finally{globalThis.fetch=original}
});
test('buffer length mismatches are explicit errors',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async url=>new Response(fs.readFileSync(new URL(String(url).replace('/dataset/',''),root)));
 try{const e=structuredClone(manifest.channels[0]);e.global_channel=999;e.numerical.IMAGE.byte_length+=4;await assert.rejects(loadPlane(e),/buffer length mismatch/)}finally{globalThis.fetch=original}
});
