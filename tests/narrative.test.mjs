import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {samplePixel} from '../src/investigation/model.ts';
import {inspectionMatches,explainPixel,flaggedCorePixel} from '../src/investigation/interpretation.ts';
const m=JSON.parse(fs.readFileSync(new URL('../public/investigations/rdra-v1/manifest.json',import.meta.url),'utf8'));
function load(o){const b=k=>Uint8Array.from(fs.readFileSync(new URL('../public/'+o.assets[k].path,import.meta.url))).buffer;return {image:new Float32Array(b('image')),variance:new Float32Array(b('variance')),flags:new Uint32Array(b('flags')),mask:new Uint8Array(b('mask')),sky:new Float64Array(b('sky'))}}
test('default selection and changed epochs never count as intentional pixel inspection',()=>{
 const selected={x:23,y:23};assert.equal(inspectionMatches(null,m.observations[0].id,selected),false);
 const action={observationId:m.observations[0].id,...selected};assert.equal(inspectionMatches(action,m.observations[0].id,selected),true);assert.equal(inspectionMatches(action,m.observations[1].id,selected),false);assert.equal(inspectionMatches(action,m.observations[0].id,{x:24,y:23}),false);
});
test('core action follows actual excluded data and explanation separates missing values from flags',()=>{
 for(const o of m.observations){const d=load(o),p=flaggedCorePixel(o,d);assert.ok(p);const s=samplePixel(o,d,p.x,p.y),e=explainPixel(s);assert.equal(s.accepted,false);assert.ok(e.reasons.some(v=>v.includes('IMAGE')));assert.ok(e.reasons.some(v=>v.includes('VARIANCE')));assert.ok(e.reasons.some(v=>v.includes('OVERFLOW')));assert.ok(e.reasons.some(v=>v.includes('SUR_ERROR')));assert.ok(!e.reasons.some(v=>v.startsWith('SOURCE')));assert.match(e.display,/excluded|missing/i);}
});
test('accepted SOURCE-only pixel has genuine evidence without an exclusion narrative',()=>{
 const o=m.observations[1],d=load(o),p=o.referencePixels.find(p=>p.accepted),s=samplePixel(o,d,p.x,p.y),e=explainPixel(s);assert.equal(s.accepted,true);assert.equal(e.reasons.length,0);assert.match(e.title,/passes/i);assert.ok(!e.permission.includes('cannot be used'));assert.equal(s.value,35.69618225097656);
});
test('excluded off-center pixels use their own evidence rather than an exact-center trigger',()=>{
 const o=m.observations[0],d=load(o);const i=d.mask.findIndex((v,i)=>v===1&&i!==23*47+23);const x=i%47,y=Math.floor(i/47),s=samplePixel(o,d,x,y);assert.equal(s.accepted,false);assert.ok(explainPixel(s).reasons.length>0);assert.equal(inspectionMatches({observationId:o.id,x,y},o.id,{x,y}),true);
});

test('guided usable defaults are verified from each native buffer and never manufacture acceptance',async()=>{
 const {usableReferencePixel}=await import('../src/investigation/interpretation.ts');
 for(const [i,o] of m.observations.entries()){const d=load(o),p=usableReferencePixel(o,d);assert.deepEqual(p,i===0?{x:21,y:18}:{x:19,y:27});const s=samplePixel(o,d,p.x,p.y);assert.equal(s.accepted,true);assert.deepEqual(s.flagNames,['SOURCE']);assert.equal(s.sigma,Math.sqrt(s.variance));assert.equal(inspectionMatches(null,o.id,p),false);}
 const o=m.observations[0],d=load(o);d.mask.fill(1);assert.equal(usableReferencePixel(o,d),null);
});

test('June usable sample and current export use native values and double precision sqrt variance',()=>{const o=m.observations[0],d=load(o),s=samplePixel(o,d,21,18);assert.equal(s.value,49.27613067626953);assert.equal(s.variance,0.0633765161037445);assert.equal(s.sigma,Math.sqrt(s.variance));assert.deepEqual(s.flagNames,['SOURCE']);});
test('unresolved mask exclusion receives an honest reason without invented flags',()=>{const o=m.observations[0],s=samplePixel(o,load(o),21,18),e=explainPixel({...s,accepted:false,value:null,sigma:null});assert.match(e.reasons.join(' '),/no more specific exclusion reason/);assert.ok(!e.reasons.join(' ').includes('OVERFLOW'));});
