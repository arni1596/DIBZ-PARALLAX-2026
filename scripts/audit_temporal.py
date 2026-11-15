"""Bounded, read-only temporal audit. Run from explorer with research venv Python."""
import csv, hashlib, json, warnings, itertools
from PIL import Image
from pathlib import Path
import numpy as np
from astropy.io import fits
from astropy.wcs import WCS
from scipy.ndimage import map_coordinates, maximum_filter, minimum_filter
ROOT=Path(__file__).resolve().parents[1]
def dump(name,obj): (ROOT/name).write_text(json.dumps(obj,indent=2,allow_nan=False),encoding='utf-8')
def sha(p):
 h=hashlib.sha256()
 with open(p,'rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def csvout(name,rows):
 with open(ROOT/name,'w',newline='',encoding='utf-8') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
def main():
 d=json.loads((ROOT/'public/dataset/dated_exposures.json').read_text()); prior=json.loads((ROOT/'public/dataset/processing_report.json').read_text())['input_hashes_before']
 before={p:sha(p) for p in prior}; obs={}; arrays={}
 external={r['filename']:r for r in csv.DictReader(open(ROOT.parent/'observations_11.csv',newline=''))}
 for e in d['exposures']:
  p=e['source_reference']['path'];ext=external[e['filename']];cw=float(ext['cwave_um']) if ext['cwave_um'] not in ('','None','null') else None;cb=float(ext['cband_um']) if ext['cband_um'] not in ('','None','null') else None
  with fits.open(p,memmap=False) as hd:
   h=hd['IMAGE'].header;im=hd['IMAGE'].data.copy();fl=hd['FLAGS'].data.astype('uint32');va=hd['VARIANCE'].data.copy()
   with warnings.catch_warnings(record=True) as ws:
    warnings.simplefilter('always');w=WCS(h,hd).celestial
    y,x=np.indices(im.shape);ra,dec=w.all_pix2world(x,y,0);xx,yy=w.all_world2pix(ra,dec,0)
   vals,counts=np.unique(fl,return_counts=True)
   # SOURCE bit is informational, not a rejection of astronomical sources.
   valid=np.isfinite(im)&np.isfinite(va)&(va>0)&((fl & np.uint32(0xffffffff ^ (1<<21)))==0)
   flag_definitions={c.keyword:dict(value=str(c.value),comment=c.comment) for c in hd['FLAGS'].header.cards if c.keyword.startswith('MP_')}
   sh=h.copy()
   for k in list(sh):
    if k.startswith(('A_','B_','AP_','BP_')):del sh[k]
   sw=WCS(sh,hd,key='W')
   spectral_values=sw.all_pix2world(np.array([0.,im.shape[1]-1,(im.shape[1]-1)/2]),np.array([0.,im.shape[0]-1,(im.shape[0]-1)/2]),0)
   o=dict(external_cwave_um=cw,external_cband_um=cb,external_calibration_status='AVAILABLE_PROVENANCE_UNVERIFIED' if cw is not None else 'UNAVAILABLE',flag_header_definitions=flag_definitions,approximate_spectral_corner_center_samples_um=[np.asarray(z).tolist() for z in spectral_values],filename=e['filename'],source_path=p,source_sha256=before[p],observation_id=h['OBSID'],timestamp=h['DATE-OBS']+'Z',mjd=float(h['MJD-OBS']),detector=int(h['DETECTOR']),release=e['archive_release'],pipeline=e['pipeline_version'],wavelength_um=e['approximate_wavelength_um'],bandwidth_um=e['approximate_bandwidth_um'],spectral_status='WAVE-TAB approximate visualization metadata; separately recorded external CWAVE/CBAND never imply verified provenance',flags=json.dumps(dict(zip(map(str,vals.tolist()),counts.tolist()))),flag_bits=json.dumps({str(b):int(((fl&(1<<b))!=0).sum()) for b in range(32) if np.any(fl&(1<<b))}),excluded_pixels=int((~valid).sum()),pixels=int(im.size),variance_zero_pixels=int((va==0).sum()),finite_pixels=int(np.isfinite(im).sum()),finast=h.get('FINAST'),spatial_ctype=[h['CTYPE1'],h['CTYPE2']],sip_retained=w.sip is not None,wcs_roundtrip_max_pixels=float(np.max(np.hypot(xx-x,yy-y))),warnings=[str(z.message) for z in ws],l1=h.get('L1DQAFLG'),l2=h.get('L2DQAFLG'),calibration_verified=False,calibration_history=[str(z) for z in h.get('HISTORY',[]) if '[CALIB]' in str(z)])
   obs[e['filename']]=o;arrays[e['filename']]=(im,fl,va,valid,w)
 rows=[]
 for i,(p,(ea,eb)) in enumerate(zip(d['pairs'],itertools.combinations(d['exposures'],2))):
  assert p['a']==ea['observation_id'] and p['b']==eb['observation_id']
  a,b=obs[ea['filename']],obs[eb['filename']];ia,fa,va,ma,wa=arrays[ea['filename']];ib,fb,vb,mb,wb=arrays[eb['filename']]
  y,x=np.indices(ia.shape);ra,dec=wa.all_pix2world(x,y,0);bx,by=wb.all_world2pix(ra,dec,0);inside=(bx>=0)&(by>=0)&(bx<=ib.shape[1]-1)&(by<=ib.shape[0]-1)
  delta=abs(a['wavelength_um']-b['wavelength_um']);width=min(a['bandwidth_um'],b['bandwidth_um']);over=max(0,min(a['wavelength_um']+a['bandwidth_um']/2,b['wavelength_um']+b['bandwidth_um']/2)-max(a['wavelength_um']-a['bandwidth_um']/2,b['wavelength_um']-b['bandwidth_um']/2))/width
  external_overlap=None
  if all(z is not None for z in (a['external_cwave_um'],a['external_cband_um'],b['external_cwave_um'],b['external_cband_um'])):
   ac,aw,bc,bw=a['external_cwave_um'],a['external_cband_um'],b['external_cwave_um'],b['external_cband_um'];external_overlap=max(0,min(ac+aw/2,bc+bw/2)-max(ac-aw/2,bc-bw/2))/min(aw,bw)
  categories=['B','C'];fundamental=[]
  if a['detector']!=b['detector']:fundamental.append('different detector/spectral region')
  if over==0:fundamental.append('disjoint approximate passbands')
  if a['mjd']==b['mjd']:fundamental.append('same observation time; not an independent temporal epoch')
  if not inside.any():fundamental.append('no pixel-center spatial overlap')
  if fundamental:categories.insert(0,'A')
  rows.append(dict(pair_id=f'temporal-{i+1:02d}',a=p['a'],b=p['b'],a_filename=a['filename'],b_filename=b['filename'],a_source_path=a['source_path'],b_source_path=b['source_path'],a_source_sha256=a['source_sha256'],b_source_sha256=b['source_sha256'],a_timestamp_utc=a['timestamp'],b_timestamp_utc=b['timestamp'],separation_days=abs(a['mjd']-b['mjd']),a_detector=a['detector'],b_detector=b['detector'],a_release=a['release'],b_release=b['release'],a_pipeline=a['pipeline'],b_pipeline=b['pipeline'],a_wavelength_um=a['wavelength_um'],b_wavelength_um=b['wavelength_um'],a_bandwidth_um=a['bandwidth_um'],b_bandwidth_um=b['bandwidth_um'],a_external_cwave_um=a['external_cwave_um'],b_external_cwave_um=b['external_cwave_um'],a_external_cband_um=a['external_cband_um'],b_external_cband_um=b['external_cband_um'],external_rectangular_overlap_fraction=external_overlap,external_calibration_provenance_verified=False,wavelength_difference_um=delta,center_difference_in_narrower_bandwidths=delta/width,rectangular_overlap_fraction=over,spatial_overlap_fraction_a=float(inside.mean()),spatial_wcs_valid=bool(np.isfinite(bx).all() and np.isfinite(by).all()),a_wcs_roundtrip_pixels=a['wcs_roundtrip_max_pixels'],b_wcs_roundtrip_pixels=b['wcs_roundtrip_max_pixels'],existing_registration='native WCS only; no independent residual',a_flags=a['flags'],b_flags=b['flags'],a_excluded_pixels=a['excluded_pixels'],b_excluded_pixels=b['excluded_pixels'],calibration='HISTORY UUIDs recorded; available external CWAVE/CBAND values recorded separately; detector calibration identity unverified',original_disabled_reasons='; '.join(p['disabled_reasons']),blocker_categories=','.join(categories),classification_evidence='; '.join(fundamental+['B: response and independent alignment evidence missing; partial approximate overlap is not a fundamental impossibility or a pass','C: application requires science usability/calibration even for exploratory visual comparison','C: OBSID shared across detectors; filename required for unambiguous observation lookup']),selected_for_deeper_analysis=False,comparison_enabled=False))
 ranked=sorted(rows,key=lambda r:(r['a_detector']==r['b_detector'],r['rectangular_overlap_fraction'],r['spatial_overlap_fraction_a']),reverse=True)
 selected=[r for r in ranked if r['a_detector']==r['b_detector'] and r['rectangular_overlap_fraction']>.5 and r['separation_days']>0][:3]
 analyses=[]
 for r in selected:
  r['selected_for_deeper_analysis']=True
  ia,fa,va,ma,wa=arrays[r['a_filename']];ib,fb,vb,mb,wb=arrays[r['b_filename']];y,x=np.indices(ia.shape);ra,dec=wa.all_pix2world(x,y,0);bx,by=wb.all_world2pix(ra,dec,0)
  geo=(bx>=0)&(by>=0)&(bx<=ib.shape[1]-1)&(by<=ib.shape[0]-1)
  # Bilinear interpolation permitted only if every nonzero kernel contribution is valid.
  support=map_coordinates(mb.astype(float),[by,bx],order=1,mode='constant',cval=0,prefilter=False)
  good=geo&ma&(support>=1-1e-10)
  reg=map_coordinates(np.where(mb,ib,0),[by,bx],order=1,mode='constant',cval=0,prefilter=False);reg[~good]=np.nan
  finite=good&np.isfinite(reg)
  corr=float(np.corrcoef(ia[finite],reg[finite])[0,1]) if finite.sum()>2 else None
  peaks=[]
  for im,mask in [(ia,ma),(ib,mb)]:
   z=np.where(mask,im,-np.inf);med=np.median(im[mask]);sig=1.4826*np.median(abs(im[mask]-med));pk=(z==maximum_filter(z,size=5))&mask&(z>med+5*sig);py,px=np.where(pk);peaks.append(list(zip(px.tolist(),py.tolist())))
  field_candidates=[]
  for im,mask,w in [(ia,ma,wa),(ib,mb,wb)]:
   cy,cx=np.indices(im.shape);rx,ry=w.all_world2pix(210.80227,54.34895,0)
   safe=minimum_filter(mask.astype('uint8'),size=5,mode='constant',cval=0).astype(bool)
   safe &= np.hypot(cx-rx,cy-ry)>4
   z=np.where(mask,im,-np.inf);med=np.median(im[mask]);sig=1.4826*np.median(abs(im[mask]-med))
   py,px=np.where((z==maximum_filter(z,size=5))&safe&(z>med+5*sig))
   field_candidates.append(np.column_stack([px,py]).astype(float))
  pa,pb=field_candidates;projected=[];matches=[]
  if len(pb):
   pra,pdec=wb.all_pix2world(pb[:,0],pb[:,1],0);qx,qy=wa.all_world2pix(pra,pdec,0);projected=np.column_stack([qx,qy]).tolist()
  if len(pa) and len(pb):
   dist=np.linalg.norm(pa[:,None,:]-np.asarray(projected)[None,:,:],axis=2)
   for ai,bi in enumerate(np.argmin(dist,axis=1)):
    if np.argmin(dist[:,bi])==ai and dist[ai,bi]<=2:
     offset=pa[ai]-np.asarray(projected)[bi]
     matches.append(dict(a_xy=pa[ai].tolist(),b_native_xy=pb[bi].tolist(),b_projected_a_xy=projected[bi],offset_a_pixels=offset.tolist(),separation_pixels=float(dist[ai,bi])))
  matching=dict(executed=True,criteria='Native local maxima within 5x5, intensity > median+5*(1.4826*MAD); complete valid 5x5 kernel excludes edges and flags; radius >4 native pixels from M101 reference; project B with primary TAN-SIP onto A; mutual nearest neighbor <=2 A pixels. At least 3 spatially separated non-collinear matches and source identity review required for residual validation.',a_candidate_xy=pa.tolist(),b_candidate_xy=pb.tolist(),b_projected_a_xy=projected,matches=matches,match_count=len(matches),minimum_matches_for_validation=3,residual_validation_pass=False,interpretation='Insufficient candidate matches for independent residual validation; candidates are not identified stars and this does not prove absence of background sources.')
  assert len(matches)<3, 'Unexpected source support: inspect before issuing verdict'
  analyses.append(dict(pair_id=r['pair_id'],a=r['a'],b=r['b'],method='Primary celestial TAN-SIP WCS, origin=0; A native pixel grid; scipy.ndimage.map_coordinates bilinear order=1; no fitted transform',spatial_sip_retained=True,shape_yx=list(ia.shape),geometric_overlap_pixels=int(geo.sum()),outside_overlap_pixels=int((~geo).sum()),common_valid_pixels=int(good.sum()),common_valid_fraction_a=float(good.mean()),mask_method='finite IMAGE and finite positive VARIANCE; retain informational SOURCE bit21; reject every other set bit; require all bilinear contributors valid',variance_interpretation='positive variance required; zero never treated as exact',image_correlation_exploratory=corr,local_5sigma_peak_pixels=peaks,independent_background_sources_established=0,background_source_matching=matching,background_source_matching_status='EXECUTED_BOUNDED_CANDIDATE_ATTEMPT_INSUFFICIENT_MATCHES',residual_pixels=None,residual_status='NOT_VALIDATED: bounded mutual-nearest peak matching produced insufficient independent field points; no residual fit justified; WCS inverse roundtrip is numerical consistency only, not astrometric accuracy',a_filename=r['a_filename'],b_filename=r['b_filename'],external_rectangular_overlap_fraction=r['external_rectangular_overlap_fraction'],external_calibration_provenance_verified=False,approximate_center_difference_bandwidths=r['center_difference_in_narrower_bandwidths'],approximate_rectangular_overlap_fraction=r['rectangular_overlap_fraction'],spectral_status='NOT_VALIDATED: half-bandwidth offset; approximation does not establish equal spectral response',level2_pass=False,assets_emitted=False))
 after={p:sha(p) for p in prior};assert before==after;assert len(rows)==55
 csvout('temporal_pair_audit.csv',rows)
 csvout('temporal_candidate_ranking.csv',[dict(rank=i+1,pair_id=r['pair_id'],a=r['a'],b=r['b'],same_detector=r['a_detector']==r['b_detector'],approximate_passband_overlap=r['rectangular_overlap_fraction'],external_rectangular_overlap_fraction=r['external_rectangular_overlap_fraction'],external_calibration_provenance_verified=False,spatial_overlap_fraction=r['spatial_overlap_fraction_a'],selected_for_deeper_analysis=r['selected_for_deeper_analysis'],reason='Deeper assessment: closest same-detector approximate passbands' if r in selected else 'Not selected: inferior spectral match or different detector',level2_pass=False) for i,r in enumerate(ranked)])
 dump('temporal_registration_report.json',dict(schema_version=1,observations=list(obs.values()),selected_candidate_count=len(selected),analyses=analyses,observation_identity_note='OBSID alone is shared across detectors; pair order is verified against original exposure combinations and file names uniquely key arrays.',hashes_before=before,hashes_after=after,input_integrity_unchanged=before==after,baseline_hashes_match=before==prior,spatial_sip_policy='Retain primary TAN-SIP. Spectral alternate WCS cleaning must never be applied to celestial WCS.',warnings_policy='Captured Python warnings per observation; primary spatial CTYPE has -SIP and SIP coefficients are consistent. Alternate A/W may trigger Astropy informational SIP inconsistency logs if naively built; do not use those for spatial geometry.',scope='11 local dated FITS, all 55 original pairs; two best pairs resampled only in memory; no original files or mosaic modified'))
 dump('temporal_verdict.json',dict(schema_version=1,decision='NO-GO_LEVEL_2',classification='DATED_IMAGES_ONLY',level1_pass=True,level2_pass=False,level3_pass=False,original_pair_count=55,enabled_pair_count=0,enabled_pairs=[],selected_pair_ids=[r['pair_id'] for r in selected],evidence=['11 authentic dated FITS inspected and checksummed','All 55 original pairs audited; two closest same-detector pairs underwent actual WCS resampling and conservative mask propagation','Best approximate rectangular overlap is only about 55%; no measured matched response established','No independent common-background-source residual solution established'],unresolved=['External CWAVE/CBAND available for D2 but provenance unverified; remaining external values unavailable; effective spectral-response compatibility unvalidated','Independent geometric residual uncertainty unavailable','Pipeline differences and source-core flags preclude quantitative interpretation'],permitted_experience='Authentic native dated-observation gallery with provenance; no registered blink/divider or variability/motion claims',scientific_inputs_unchanged=before==after))
 (ROOT/'temporal_science_limitations.md').write_text('''# Temporal science decision\n\nNO-GO for Level 2; DATED_IMAGES_ONLY for Level 1. All 55 comparisons remain disabled.\n\nThe two closest same-detector pairs (D2 and D5) were actually transformed in memory onto the first observation spatial grid with primary TAN-SIP WCS and bilinear interpolation. Geometric overlap, all-contributor mask propagation, positive variance, per-bit distributions and approximate bandwidths are recorded in temporal_registration_report.json. Original arrays were preserved. No comparison assets were emitted.\n\nA small numerical WCS roundtrip error verifies inversion consistency only. It does not measure independent registration residual. A bounded mutual-nearest matching attempt was executed on native 5-sigma local maxima after WCS projection, excluding the central 4-pixel galaxy radius and requiring complete valid 5x5 kernels. The 2-pixel match radius and minimum 3 non-collinear independent field points are documented with candidate positions and offsets. Neither pair supplied enough matches for residual validation. Candidates are not identified stars; this result does not establish absence of background sources. No residual fit was justified; the recorded validated residual is null. FINAST is supporting pipeline metadata, not our own residual measurement. Correlation and local peak counts are exploratory diagnostics, not proof of astrometric registration or variability.\n\nBoth best pairs differ by roughly 0.45 of the narrower bandwidth and overlap only about 55% under an approximate rectangular model. The former 2% center threshold is insufficient. WAVE-TAB values are explicitly approximate visualization wavelength and bandwidth; external CWAVE/CBAND are available for D2 (separately recorded, provenance unverified), while unavailable for other detectors; this availability/provenance limitation alone would not disqualify exploratory Level 2, but the large relative bandpass displacement and lack of demonstrated equal response are substantive limitations. Different spectral weighting can alter apparent galaxy morphology.\n\nPrimary RA---TAN-SIP/DEC--TAN-SIP retains SIP coefficients. A/W alternate WCS uses distinct detector/spectral mappings; their SIP cleanup convention must not be transferred to the celestial spatial solution. Astropy warnings are captured in the report. Informational warnings from alternate WCS construction describe a different solution, not permission to remove primary distortion.\n\nSOURCE bit 21 is informational and retained; every other nonzero bit is conservatively excluded, not interpreted as universally fatal. This conservative display mask may exclude usable pixels. Bilinear pixels require all contributing inputs valid; outside-overlap pixels remain excluded. Zero or nonfinite variance never represents zero uncertainty. No flagged value is replaced with synthetic image measurements.\n\nCalibration HISTORY identifiers, actual source hashes, observation dates, processing release and pipeline versions are recorded. These do not establish external calibration identity or cross-epoch photometric equivalence. QR2 processing versions differ for the closest pairs. Source-core quality can limit brightness measurements even where a field display remains feasible.\n\nLevel 3 is unsupported: no flux change, motion, discovery, or numerical astronomical difference is asserted. The authentic native gallery must label images independently scaled and spatially unregistered. Original OBSID values are shared across detectors, so unique filenames/SHA256 identify the 11 distinct image products; the original 55 ordered pair records are verified against exposure combinations. This lookup ambiguity is an implementation restriction, recorded as category C.\n\nReproduce from explorer: `python scripts/audit_temporal.py`. The script hashes the 17 recorded original inputs before and after, reads FITS without writes, audits every pair, ranks all pairs and analyzes only the two closest candidates.\n\nReference: [Official SPHEREx Explanatory Supplement v1.2.1](https://irsa.ipac.caltech.edu/data/SPHEREx/docs/SPHEREx_Expsupp_QR_v1.2.1.pdf), spectral WCS visualization and calibration definitions.\n''',encoding='utf-8')
 import sys
 if '--reports-only' in sys.argv:return
 gallery_dir=ROOT/'public/temporal';gallery_dir.mkdir(exist_ok=True)
 gallery=[]
 for e in d['exposures']:
  o=obs[e['filename']];im,fl,va,valid,w=arrays[e['filename']]
  low,high=np.percentile(im[valid],[1,99]);grey=np.uint8(np.clip((np.where(valid,im,low)-low)/(high-low),0,1)*255)
  rgba=np.stack([grey,grey,grey,np.uint8(valid)*255],axis=-1);name=e['filename'].replace('.fits','.png');dest=gallery_dir/name;Image.fromarray(rgba).save(dest)
  gallery.append(dict(observation_id=o['observation_id'],filename=o['filename'],timestamp_utc=o['timestamp'],detector=o['detector'],archive_release=o['release'],pipeline_version=o['pipeline'],source_fits=dict(path=o['source_path'],sha256=o['source_sha256']),wavelength_um=o['wavelength_um'],bandwidth_um=o['bandwidth_um'],wavelength_method=o['spectral_status'],external_calibration=dict(cwave_um=o['external_cwave_um'],cband_um=o['external_cband_um'],status=o['external_calibration_status'],provenance_status='UNVERIFIED',method='External CWAVE/CBAND values available but calibration lineage unverified' if o['external_cwave_um'] is not None else 'External CWAVE/CBAND unavailable; approximate WAVE-TAB displayed',provenance_verified=False),preview=dict(path='/temporal/'+name,sha256=sha(dest),width=im.shape[1],height=im.shape[0],low=float(low),high=float(high),unit='MJy / sr',display_method='Independent 1/99 percentile linear grayscale; native unregistered pixels; transparent excluded mask'),quality=dict(eligible_count=int(valid.sum()),total_count=int(im.size),missing_count=int((~np.isfinite(im)).sum()),rejected_count=int((np.isfinite(im)&~valid).sum()),policy='Finite IMAGE, finite positive VARIANCE, retain SOURCE bit21 only; all other set bits including FULLSAMPLE excluded conservatively. No universally safe assertion.',flag_distribution=json.loads(o['flags'])),calibration_status='UNVERIFIED'))
 dump('public/temporal/gallery.json',dict(schema_version=1,capability='DATED_IMAGES_ONLY',source_pair_count=55,enabled_pair_count=0,exposures=gallery,decision_summary='Authentic dated native images; Level 2 not established by independent residual and spectral response evidence.',limitations=['Independently scaled; do not compare brightness','Native grids are not aligned','Approximate wavelength and bandwidth; measured response equivalence unavailable','No variability or motion inference'],verdict_path='/temporal/temporal_verdict.json'))
 print(json.dumps({'selected':len(selected),'analyses':analyses,'hashes_unchanged':before==after,'baseline_hashes_match':before==prior},indent=2))
if __name__=='__main__':main()

