import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const journey=readFileSync(new URL('../src/journey.tsx',import.meta.url),'utf8');
const header=readFileSync(new URL('../src/SiteHeader.tsx',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.tsx',import.meta.url),'utf8');

test('the first-time URL starts with the first chapter',()=>{
 assert.match(journey,/useState\(location\.hash\?\(journeyAct\(location\.hash\)\?\?0\):0\)/);
 assert.match(journey,/setAct\(location\.hash\?\(journeyAct\(location\.hash\)\?\?0\):0\)/);
});

test('evidence shortcut targets match each explorer mode',()=>{
 assert.match(main,/href:mode==='investigation'\?'#investigation-verify':mode==='time'\?'#dated-evidence':'#evidence'/);
 assert.match(main,/getElementById\(mode==='investigation'\?'investigation-verify':mode==='time'\?'dated-evidence':'evidence'\)/);
});

test('M101 published file identity is accurately represented',()=>{
 assert.match(header,/independently byte-matched to the retained original/);
 assert.match(header,/Calibration lineage and contributing exposures remain unverified/);
 assert.doesNotMatch(header,/remote-byte identity are unresolved/);
 assert.doesNotMatch(header,/remote identity unverified/);
});
