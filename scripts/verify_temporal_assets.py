"""Independent per-pixel verification of new native dated previews; never writes FITS."""
import json, csv, hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from astropy.io import fits
ROOT=Path(__file__).resolve().parents[1]
g=json.loads((ROOT/'public/temporal/gallery.json').read_text())
rows=list(csv.DictReader((ROOT/'temporal_pair_audit.csv').open(newline='',encoding='utf-8')))
assert len(rows)==55 and len({r['pair_id'] for r in rows})==55
assert all(r['comparison_enabled']=='False' for r in rows)
assert len({tuple(sorted([r['a_filename'],r['b_filename']])) for r in rows})==55
checks=[]
for e in g['exposures']:
 source=Path(e['source_fits']['path']);before=hashlib.sha256(source.read_bytes()).hexdigest();assert before==e['source_fits']['sha256']
 with fits.open(source,memmap=False,mode='readonly') as hd:
  im=np.asarray(hd['IMAGE'].data);flags=np.asarray(hd['FLAGS'].data,dtype=np.uint32);variance=np.asarray(hd['VARIANCE'].data)
  valid=np.isfinite(im)&np.isfinite(variance)&(variance>0)&((flags&np.uint32(0xffffffff^(1<<21)))==0)
  preview=ROOT/'public'/e['preview']['path'].lstrip('/');rgba=np.asarray(Image.open(preview).convert('RGBA'))
  assert np.array_equal(rgba[:,:,3],valid.astype(np.uint8)*255),e['filename']
  expected=np.uint8(np.clip((np.where(valid,im,e['preview']['low'])-e['preview']['low'])/(e['preview']['high']-e['preview']['low']),0,1)*255)
  for ch in range(3):assert np.array_equal(rgba[:,:,ch],expected),e['filename']
  assert hashlib.sha256(preview.read_bytes()).hexdigest()==e['preview']['sha256']
  assert valid.sum()==e['quality']['eligible_count']
  assert int((~np.isfinite(im)).sum())==e['quality']['missing_count']
  assert int((np.isfinite(im)&~valid).sum())==e['quality']['rejected_count']
 assert hashlib.sha256(source.read_bytes()).hexdigest()==before
 checks.append({'filename':e['filename'],'pixels':int(valid.size),'eligible':int(valid.sum()),'png_matches_native_values_and_mask':True,'original_sha256_unchanged':True})
r=json.loads((ROOT/'temporal_registration_report.json').read_text());v=json.loads((ROOT/'temporal_verdict.json').read_text())
assert len(r['analyses'])==2 and all(not a['level2_pass'] and a['residual_pixels'] is None and a['spatial_sip_retained'] for a in r['analyses'])
assert r['hashes_before']==r['hashes_after'] and len(r['hashes_before'])==17
assert v['classification']=='DATED_IMAGES_ONLY' and not v['level2_pass'] and not v['level3_pass'] and v['enabled_pair_count']==0
out={'status':'PASS','pair_count':55,'candidate_resamplings':2,'images_checked':len(checks),'pixel_checks':checks,'registration_gate':'NOT PASSED','original_input_hashes_unchanged':17}
(ROOT/'temporal_asset_verification.json').write_text(json.dumps(out,indent=2),encoding='utf-8');print(json.dumps(out,indent=2))
