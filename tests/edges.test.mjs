import test from 'node:test';import assert from 'node:assert/strict';
import {outsideFramePixels,withFrameExtent} from '../src/science.ts';
test('a source circle crossing a frame edge is explicitly partial, never falsely complete',()=>{
 assert.equal(outsideFramePixels({kind:'disk',x:0,y:0,radius:1},267,267),2);
 assert.equal(outsideFramePixels({kind:'disk',x:133,y:133,radius:4},267,267),0);
 const sample={availability:'COMPLETE',eligible:3,total:3};const result=withFrameExtent(sample,2);assert.equal(result.availability,'PARTIAL');assert.equal(result.outside,2);assert.equal(result.total,3);
});
