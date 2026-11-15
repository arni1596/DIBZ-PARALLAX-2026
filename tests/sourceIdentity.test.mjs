import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {matchedM101Source} from '../src/sourceIdentity.ts';
const receipt=JSON.parse(fs.readFileSync(new URL('../release/M101_REMOTE_RECEIPT.json',import.meta.url),'utf8'));
test('public-source label is bound to the recorded exact FITS hash and URL',()=>{
 assert.equal(receipt.matchesKnownLocal,true);assert.equal(receipt.status,200);
 assert.equal(matchedM101Source(receipt.sha256,receipt.url),true);
 assert.equal(matchedM101Source('0'.repeat(64),receipt.url),false);
 assert.equal(matchedM101Source(receipt.sha256,'https://example.invalid/other.fits'),false);
});
