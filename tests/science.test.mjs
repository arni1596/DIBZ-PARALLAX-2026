import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyPixel, summarize, pixelToSky, regionIndices, validateContracts, comparisonAllowed} from '../src/science.ts';
import fs from 'node:fs';
const root=new URL('../public/dataset/',import.meta.url);
const read=n=>JSON.parse(fs.readFileSync(new URL(n,root),'utf8'));
const bundle=()=>({channels:read('channels_102.json').channels,coverage:read('channel_coverage_102.json'),manifest:read('image_manifest.json'),science:read('science_metadata.json'),report:read('processing_report.json'),verification:read('verification_results.json'),dated:read('dated_exposures.json')});
test('source bit alone stays eligible; missing, zero-hit and rejected flags stay distinct',()=>{
 assert.equal(classifyPixel(1,2,1<<21),'eligible');
 assert.equal(classifyPixel(NaN,0,0),'missing');
 assert.equal(classifyPixel(1,0,0),'missing');
 assert.equal(classifyPixel(1,1,1<<19),'quality-rejected');
 assert.equal(classifyPixel(1,1,1<<1),'quality-rejected');
 assert.equal(classifyPixel(1,1,1<<7),'quality-rejected');
});
test('region means use only eligible raw values, never substitute missing values',()=>{
 const p={image:new Float32Array([2,4,100,NaN]),hits:new Int32Array([1,1,1,0]),flags:new Int32Array([0,1<<21,1<<19,0]),mask:new Uint8Array([1,1,0,0])};
 const r=summarize(p,[0,1,2,3]); assert.equal(r.value,3);assert.equal(r.eligible,2);assert.equal(r.missing,1);assert.equal(r.rejected,1);
 assert.equal(summarize(p,[2,3]).value,null);
});
test('TAN reference origin and predefined regions match verified native grid',()=>{
 const d=bundle();const w=d.science.spatial.wcs_header;
 const [ra,dec]=pixelToSky(133,133,w);assert.ok(Math.abs(ra-w.CRVAL1)<1e-10);assert.ok(Math.abs(dec-w.CRVAL2)<1e-10);
 for(const [id,n] of [['target_pixel',1],['core_30arcsec',37],['central_120arcsec',553],['reference_annulus_240_360arcsec',2787],['full_frame',71289]])assert.equal(regionIndices({kind:id,x:133,y:133,radius:0},d.science).length,n);
});
test('contract joins use global IDs; mismatched wavelengths or readiness fail closed',()=>{
 const d=bundle(); validateContracts(d);d.manifest.channels.reverse();validateContracts(d);
 d.manifest.channels[0].wavelength_um+=.1;assert.throws(()=>validateContracts(d),/wavelength/i);
 const bad=bundle();bad.report.dataset_ready_for_exploratory_interface=false;assert.throws(()=>validateContracts(bad),/readiness/i);
});
test('all 55 dated pairs remain disabled despite candidate spectral screening',()=>{
 const d=bundle();assert.equal(d.dated.pairs.length,55);for(const p of d.dated.pairs)assert.equal(comparisonAllowed(p),false);
});
