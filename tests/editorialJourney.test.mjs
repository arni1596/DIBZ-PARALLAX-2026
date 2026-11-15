import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const journey=readFileSync(new URL('../src/journey.tsx',import.meta.url),'utf8');
const story=readFileSync(new URL('../src/GuidedStory.tsx',import.meta.url),'utf8');
const azure=readFileSync(new URL('../scripts/generate-azure-narration.mjs',import.meta.url),'utf8');

test('narrated chapters follow all six sections without skipping the Pluto precedent',()=>{
 const actions=[...story.matchAll(/\{title:'[^']+',body:'[^']*',action:'[^']+',next:(\d+)\}/g)].map(x=>Number(x[1]));
 assert.deepEqual(actions,[1,2,3,4,5,1]);
 assert.match(story,/Clyde Tombaugh/);
 assert.match(journey,/onClick=\{\(\)=>go\(act===2\?3:4\)\}/);
 assert.doesNotMatch(journey,/go\(act===2\?3:5\)/);
});

test('narrated audio is versioned to match the revised source transcript',()=>{
 assert.match(story,/narration\/editorial-v2\/chapter-/);
 assert.match(azure,/public\/narration\/editorial-v2/);
 assert.match(azure,/Expected 6 reviewed story chapters/);
 assert.doesNotMatch(story,/Optional Azure-prepared audio when installed/);
});

test('opening has one clear next action, with the source preserved',()=>{
 assert.match(journey,/>The universe <br\/>leaves <em>evidence\.<\/em>/);
 assert.match(journey,/Begin exploring/);
 assert.match(journey,/SPHEREx · NASA\/IPAC IRSA/);
 assert.doesNotMatch(journey,/Curated coverage—not a live arbitrary-coordinate archive/);
 assert.match(journey,/These are separate exposures\. Their wavelengths and image grids differ/);
});
