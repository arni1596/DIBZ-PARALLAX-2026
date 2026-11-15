import test from 'node:test';
import assert from 'node:assert/strict';
import { measurePair } from './m101ContrastIndependent.mjs';

test('default M101 contrast is reproduced from channel buffers without the app reducer', () => {
  const m = measurePair(35, 86);
  assert.equal(m.core.maskDisagree + m.annulus.maskDisagree, 0);
  assert.ok(m.core.geometric > 0 && m.annulus.geometric > m.core.geometric);
  assert.equal(m.core.common, m.core.geometric);
  assert.ok(m.annulus.common > 0 && m.annulus.common <= m.annulus.geometric);
  assert.ok(m.core.meanA > 0 && m.annulus.meanA > 0 && m.core.meanB > 0 && m.annulus.meanB > 0);
  assert.equal(m.ratioA.toFixed(2), '9.17');
  assert.equal(m.ratioB.toFixed(2), '4.85');
  assert.ok(Math.abs(m.ratioA - 9.17) < 0.005);
  assert.ok(Math.abs(m.ratioB - 4.85) < 0.005);
  assert.equal(m.disk8.common, 197);
  assert.equal(m.disk8.geometric, 197);
  assert.notEqual(m.verify8.meanA, m.verify45.meanA);
  const shifted = measurePair(36, 86);
  assert.notEqual(shifted.verify8.meanA, m.verify8.meanA);
  assert.equal(shifted.disk8.maskDisagree, 0);
});
