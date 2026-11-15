import test from 'node:test';
import assert from 'node:assert/strict';
import {story, narrationRevision} from '../src/story.ts';

test('guided narration visits all six chapters in order before returning to Light',()=>{
 let act=0;const visited=[];
 for(let i=0;i<6;i++){visited.push(act);act=story[act].next}
 assert.deepEqual(visited,[0,1,2,3,4,5]);assert.equal(act,1);
 assert.equal(story.length,6);assert.match(narrationRevision,/^[a-z0-9-]+$/);
});
test('narration retains wavelength, detection, comparison and passport boundaries',()=>{
 assert.match(story[1].body,/wavelengths, not dates/);
 assert.match(story[2].body,/predicted location, not a measured detection/);
 assert.match(story[3].body,/does not measure motion or brightness change/);
 assert.match(story[4].body,/Clyde Tombaugh/);
 assert.match(story[5].body,/not proof of a discovery/);
});
