import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {loadPlane} from '../src/data.ts';
const root=new URL('../public/dataset/',import.meta.url),manifest=JSON.parse(fs.readFileSync(new URL('image_manifest.json',root),'utf8'));
test('a second investigation reuses every verified native plane after all 102 channels load',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async url=>new Response(fs.readFileSync(new URL(String(url).replace('/dataset/',''),root)));
 try{const first=await loadPlane(manifest.channels[0]);for(const e of manifest.channels)await loadPlane(e);assert.equal(await loadPlane(manifest.channels[0]),first);assert.equal(first.image.length,267*267);assert.ok(Number.isFinite(first.image[133*267+133]));}finally{globalThis.fetch=original}
});
