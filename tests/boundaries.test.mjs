import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateInvestigation,validateObservationData,buildInvestigationReport} from '../src/investigation/model.ts';
import {validateContracts,pixelToSky,separationArcsec,classifyPixel} from '../src/science.ts';
import {loadPlane} from '../src/data.ts';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const manifest=()=>read('public/investigations/rdra-v1/manifest.json');
const bundle=()=>{const r=n=>read('public/dataset/'+n+'.json');return {channels:r('channels_102').channels,coverage:r('channel_coverage_102'),manifest:r('image_manifest'),science:r('science_metadata'),report:r('processing_report'),verification:r('verification_results'),dated:r('dated_exposures')}};
const buffers=o=>{const b=k=>Uint8Array.from(fs.readFileSync(new URL('../public/'+o.assets[k].path,import.meta.url))).buffer;return {image:new Float32Array(b('image')),variance:new Float32Array(b('variance')),flags:new Uint32Array(b('flags')),mask:new Uint8Array(b('mask')),sky:new Float64Array(b('sky'))}};
test('native evidence rejects invalid RA domains and malformed uncertainty/display metadata',()=>{
 for(const ra of [-1,360,Infinity,NaN]){const m=manifest();m.target.raDeg=ra;assert.throws(()=>validateInvestigation(m));}
 for(const dec of [-91,91,Infinity]){const m=manifest();m.target.decDeg=dec;assert.throws(()=>validateInvestigation(m));}
 for(const change of [o=>o.units.variance='counts',o=>o.wavelength.approximateUm=Infinity,o=>o.render.max=NaN,o=>o.render.asinhSoftening=0]){const m=manifest();change(m.observations[0]);assert.throws(()=>validateInvestigation(m));}
 const m=manifest();m.comparison.gates={};assert.throws(()=>validateInvestigation(m));
});
test('native sky buffers reject wrapped/unbounded RA instead of inventing plausible coordinates',()=>{
 const o=manifest().observations[0];for(const ra of [-.1,360,Infinity]){const d=buffers(o);d.sky[0]=ra;assert.throws(()=>validateObservationData(o,d));}
});
test('mosaic contracts reject nonfinite wavelength, duplicate planes and nonnumeric WCS',()=>{
 const bad=bundle();for(const rows of [bad.channels,bad.coverage.channels,bad.manifest.channels])rows[0].wavelength_um=NaN;assert.throws(()=>validateContracts(bad));
 const planes=bundle();for(const rows of [planes.channels,planes.coverage.channels,planes.manifest.channels])rows[1].plane_index_zero_based=rows[0].plane_index_zero_based;assert.throws(()=>validateContracts(planes));
 const wcs=bundle();wcs.science.spatial.wcs_header.CDELT1=NaN;assert.throws(()=>validateContracts(wcs));
});
test('spherical separation crosses RA zero and TAN outputs stay normalized',()=>{
 assert.ok(Math.abs(separationArcsec([359.999,0],[.001,0])-7.2)<1e-7);
 const h={...bundle().science.spatial.wcs_header,CRVAL1:359.999};for(const x of [0,133,266]){const [ra,dec]=pixelToSky(x,133,h);assert.ok(ra>=0&&ra<360);assert.ok(Number.isFinite(dec));}
 assert.throws(()=>pixelToSky(NaN,0,h));
 assert.equal(classifyPixel(1,NaN,0),'missing');
});
test('native report distinguishes detector-position wavelength and explicitly defined statistical uncertainty',()=>{
 const m=manifest(),o=m.observations[1],d=buffers(o),p=o.referencePixels.find(p=>p.accepted);const r=buildInvestigationReport(m,o,d,p.x,p.y,{});
 assert.equal(r.spectralProduct.kind,'native_lvf_observation');assert.equal(r.spectralProduct.channelAssignment,null);assert.match(r.spectralProduct.wavelengthScope,/target-center/);
 assert.equal(r.uncertainty.units,o.units.image);assert.equal(r.uncertainty.definition,'sqrt(native VARIANCE)');assert.equal(r.uncertainty.confidenceLevel,null);
});
test('a changed numerical descriptor cannot reuse a cached channel with different bytes',async()=>{
 const entry=bundle().manifest.channels[0],originalFetch=globalThis.fetch;
 globalThis.fetch=async url=>new Response(fs.readFileSync(new URL('../public'+url,import.meta.url)));
 try{await loadPlane(entry);const changed=structuredClone(entry);changed.numerical.IMAGE.sha256='0'.repeat(64);await assert.rejects(()=>loadPlane(changed),/Integrity/);}finally{globalThis.fetch=originalFetch;}
});
