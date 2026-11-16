import fs from 'node:fs';
import crypto from 'node:crypto';

const root = new URL('../public/dataset/', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('image_manifest.json', root)));
const WIDTH = 267;
const OVERFLOW = 1 << 1;
const OUTLIER = 1 << 19;
const SOURCE = 1 << 21;
const KNOWN = OVERFLOW | OUTLIER | SOURCE;

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function loadChannel(id) {
  const entry = manifest.channels.find(c => c.global_channel === id);
  if (!entry) throw new Error('Missing channel ' + id);
  const read = key => {
    const spec = entry.numerical[key];
    const bytes = fs.readFileSync(new URL(spec.path, root));
    if (bytes.byteLength !== spec.byte_length) throw new Error('Length mismatch ' + spec.path);
    if (sha256(bytes) !== spec.sha256) throw new Error('Hash mismatch ' + spec.path);
    return bytes;
  };
  const imageBytes = read('IMAGE');
  const hitsBytes = read('NHITS');
  const flagsBytes = read('FLAGS');
  const mask = read('VISUALIZATION_MASK');
  const count = WIDTH * WIDTH;
  if (imageBytes.byteLength !== count * 4 || hitsBytes.byteLength !== count * 4 || flagsBytes.byteLength !== count * 4 || mask.byteLength !== count) {
    throw new Error('Unexpected buffer size for channel ' + id);
  }
  return {
    id,
    wavelength_um: entry.wavelength_um,
    image: new Float32Array(imageBytes.buffer, imageBytes.byteOffset, count),
    hits: new Int32Array(hitsBytes.buffer, hitsBytes.byteOffset, count),
    flags: new Int32Array(flagsBytes.buffer, flagsBytes.byteOffset, count),
    mask
  };
}

/** Published quality rule, restated here without importing the application. */
export function eligible(image, hits, flags, mask) {
  if (mask === 0) return false;
  if (!Number.isFinite(image) || !Number.isFinite(hits) || hits <= 0) return false;
  if ((flags & (OVERFLOW | OUTLIER)) !== 0 || (flags & ~KNOWN) !== 0) return false;
  return true;
}

function indicesFor(kind) {
  const ids = [];
  for (let y = 0; y < WIDTH; y++) for (let x = 0; x < WIDTH; x++) {
    const rr = (x - 133) ** 2 + (y - 133) ** 2;
    if (kind === 'core' && rr <= 8 ** 2) ids.push(y * WIDTH + x);
    if (kind === 'annulus' && rr >= 27 ** 2 && rr <= 40 ** 2) ids.push(y * WIDTH + x);
    if (kind === 'disk45' && rr <= 45 ** 2) ids.push(y * WIDTH + x);
    if (kind === 'disk8' && rr <= 8 ** 2) ids.push(y * WIDTH + x);
  }
  return ids;
}

function intersection(a, b, ids) {
  let common = 0, sumA = 0, sumB = 0, excludedA = 0, excludedB = 0, maskDisagree = 0;
  for (const i of ids) {
    const classA = Number.isFinite(a.image[i]) && a.hits[i] > 0 && (a.flags[i] & (OVERFLOW | OUTLIER)) === 0 && (a.flags[i] & ~KNOWN) === 0;
    const classB = Number.isFinite(b.image[i]) && b.hits[i] > 0 && (b.flags[i] & (OVERFLOW | OUTLIER)) === 0 && (b.flags[i] & ~KNOWN) === 0;
    if ((a.mask[i] !== 0) !== classA || (b.mask[i] !== 0) !== classB) maskDisagree++;
    const ea = eligible(a.image[i], a.hits[i], a.flags[i], a.mask[i]);
    const eb = eligible(b.image[i], b.hits[i], b.flags[i], b.mask[i]);
    if (!ea) excludedA++;
    if (!eb) excludedB++;
    if (ea && eb) { common++; sumA += a.image[i]; sumB += b.image[i]; }
  }
  const meanA = common ? sumA / common : null;
  const meanB = common ? sumB / common : null;
  return { geometric: ids.length, common, excludedA, excludedB, maskDisagree, meanA, meanB, difference: meanA === null ? null : meanA - meanB };
}

export function measurePair(channelA, channelB) {
  const a = loadChannel(channelA);
  const b = loadChannel(channelB);
  const core = intersection(a, b, indicesFor('core'));
  const annulus = intersection(a, b, indicesFor('annulus'));
  const disk45 = intersection(a, b, indicesFor('disk45'));
  const disk8 = intersection(a, b, indicesFor('disk8'));
  const ratioA = core.meanA / annulus.meanA;
  const ratioB = core.meanB / annulus.meanB;
  const format = n => n.toLocaleString('en-US', { maximumFractionDigits: 7 });
  return {
    channels: [channelA, channelB],
    wavelengths: [a.wavelength_um, b.wavelength_um],
    core, annulus, disk45, disk8,
    ratioA, ratioB,
    displayed: `${ratioA.toFixed(2)}× in A, ${ratioB.toFixed(2)}× in B`,
    verify45: { common: disk45.common, total: disk45.geometric, meanA: format(disk45.meanA), meanB: format(disk45.meanB) },
    verify8: { common: disk8.common, total: disk8.geometric, meanA: format(disk8.meanA), meanB: format(disk8.meanB) }
  };
}
