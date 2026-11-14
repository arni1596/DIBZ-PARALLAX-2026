"""Offline, bounded preparation of two authentic IRSA R Dra cutouts. No downloads.
Run using an environment containing astropy, numpy and Pillow.
"""
from pathlib import Path
import argparse, csv, io, json, hashlib, zipfile
import numpy as np
from astropy.io import fits
from astropy.wcs import WCS
from astropy.wcs.utils import proj_plane_pixel_scales
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT/'tests/fixtures/rdra'
DEFAULT_ARCHIVE = None
CENTER = [248.16761083333336, 66.75497941666667]
REASONS = {
 'registration': 'Independent native detector grids; no external astrometric registration or reprojection has been validated.',
 'spectralResponse': 'WCS-WAVE is explicitly approximate visualization metadata, not validated wavelength calibration or equivalent response.',
 'psf': 'PSF extension is present but spatial PSF selection, evaluation and cross-epoch matching have not been validated.',
 'photometry': 'Central pixels are missing or quality flagged; no aperture correction, background matching or calibrated flux comparison.',
 'motion': 'Source identity and cross-epoch astrometry are not independently confirmed; image differences cannot establish motion.'}

def digest(b): return hashlib.sha256(b).hexdigest()
def dump(p,o): p.write_text(json.dumps(o,indent=2,allow_nan=False)+'\n',encoding='utf-8')
def nullable(x): return float(x) if np.isfinite(x) else None

def main():
 ap=argparse.ArgumentParser(); ap.add_argument('--source',type=Path,default=DEFAULT_SOURCE); ap.add_argument('--archive',type=Path,default=DEFAULT_ARCHIVE); ap.add_argument('--output',type=Path,default=ROOT/'public/investigations/rdra-v1'); ap.add_argument('--report',type=Path,default=ROOT/'rdra_processing_report.json'); args=ap.parse_args()
 args.output.mkdir(parents=True,exist_ok=True)
 prior={r['index']:r for r in json.loads((args.source/'measurements.json').read_text())}
 if args.archive:
  with zipfile.ZipFile(args.archive) as z:
   archive_rows={int(r['index']):r for r in csv.DictReader(io.StringIO(z.read('rdra/SPHEREx-D2/archive_rows.csv').decode()))}
   archive_records={r['index']:r for r in json.loads(z.read('rdra/SPHEREx-D2/download_records.json'))}
  archive_sha=digest(args.archive.read_bytes())
 else:
  archive_rows={int(r['index']):r for r in csv.DictReader((args.source/'archive_rows.csv').open(newline='',encoding='utf-8'))}
  archive_records={r['index']:r for r in json.loads((args.source/'download_records.json').read_text())}
  archive_sha=json.loads((args.source/'acquisition_provenance.json').read_text())['originalArchiveSha256']
 observations=[]; tests=[]
 for index in [1,52]:
  name=f'rdra_row_{index:04d}'; source=args.source/(name+'.fits'); payload=source.read_bytes(); sha=digest(payload)
  assert sha==prior[index]['sha256'], 'Original source checksum mismatch'
  if index in archive_records: assert sha==archive_records[index]['sha256']
  with fits.open(io.BytesIO(payload),memmap=False) as h:
   h.verify('exception'); assert all(k in h for k in ['IMAGE','VARIANCE','FLAGS','PSF','WCS-WAVE'])
   a=np.asarray(h['IMAGE'].data,dtype='<f4'); v=np.asarray(h['VARIANCE'].data,dtype='<f4'); f=np.asarray(h['FLAGS'].data,dtype='<u4'); ih=h['IMAGE'].header
   assert a.ndim==2 and a.shape==v.shape==f.shape==(47,47)
   bits={k[3:]:{'bit':int(h['FLAGS'].header[k]),'meaning':h['FLAGS'].header.comments[k]} for k in h['FLAGS'].header if k.startswith('MP_')}
   assert bits['SOURCE']['bit']==21
   # SOURCE is descriptive; every other set flag is conservatively excluded, including unknown bits.
   valid=np.isfinite(a)&np.isfinite(v)&(v>0)&((f & np.uint32(0xffffffff ^ (1<<21)))==0)
   mask=(~valid).astype('u1'); w=WCS(ih).celestial
   assert w.has_celestial and w.sip is not None
   yy,xx=np.indices(a.shape); ra,dec=w.pixel_to_world_values(xx,yy); sky=np.stack([ra,dec],axis=-1).astype('<f8')
   assert np.isfinite(sky).all()
   rx,ry=w.world_to_pixel_values(ra,dec); residual=float(np.max(np.hypot(rx-xx,ry-yy))); assert residual<0.01
   tx,ty=map(float,w.world_to_pixel_values(*CENTER)); core=np.hypot(xx-tx,yy-ty)<=2.5
   assets={}
   def asset(key,raw,suffix,dtype,shape,classification):
    p=args.output/(name+suffix); p.write_bytes(raw); assets[key]={'path':'investigations/rdra-v1/'+p.name,'sha256':digest(raw),'byteLength':len(raw),'dtype':dtype,'shape':shape,'classification':classification}; return p
   for key,array,suffix in [('image',a,'.image.f32'),('variance',v,'.variance.f32'),('flags',f,'.flags.u32'),('mask',mask,'.mask.u8'),('sky',sky,'.sky.f64')]:
    asset(key,array.tobytes(),suffix,str(array.dtype),list(array.shape),'Observed' if key in ['image','variance','flags'] else 'Processed')
   lo,hi=map(float,np.percentile(a[valid],[2,99.5])); scaled=np.zeros(a.shape,dtype='u1'); scaled[valid]=np.round(255*np.arcsinh(8*np.clip((a[valid]-lo)/(hi-lo),0,1))/np.arcsinh(8)).astype('u1')
   preview_rgba=np.stack([scaled,scaled,scaled,valid.astype('u1')*255],axis=-1)
   bio=io.BytesIO(); Image.fromarray(np.flipud(preview_rgba)).save(bio,format='PNG'); asset('preview',bio.getvalue(),'.preview.png','uint8',list(preview_rgba.shape),'Processed')
   rgba=np.zeros((*a.shape,4),dtype='u1'); rgba[~valid]=[245,174,76,155]; bio=io.BytesIO(); Image.fromarray(np.flipud(rgba)).save(bio,format='PNG'); asset('qualityOverlay',bio.getvalue(),'.quality.png','uint8',list(rgba.shape),'Processed')
   header=dict(ih); header.pop('COMMENT',None); header.pop('HISTORY',None)
   hp=args.output/(name+'.header.json'); dump(hp,header)
   samples=[]
   clean_pos=np.argwhere(valid); cy,cx=clean_pos[np.argmin(np.hypot(clean_pos[:,1]-tx,clean_pos[:,0]-ty))]
   finite_core=np.argwhere(core&np.isfinite(a)); by,bx=max(finite_core,key=lambda q:float(a[tuple(q)]))
   for label,x,y in [('central pixel',round(tx),round(ty)),('nearest accepted reference pixel',int(cx),int(cy)),('bright flagged core pixel',int(bx),int(by))]:
    accepted=bool(valid[y,x]); samples.append({'label':label,'classification':'Observed','x':x,'y':y,'value':nullable(a[y,x]),'variance':nullable(v[y,x]),'sigma':float(np.sqrt(v[y,x])) if accepted else None,'flags':int(f[y,x]),'flagNames':[k for k,b in bits.items() if int(f[y,x])&(1<<b['bit'])],'accepted':accepted,'sigmaClassification':'Processed','acceptanceClassification':'Processed','sigmaMeaning':'Square root of supplied per-pixel variance only; no calibration/systematic or correlated-noise certification. Not source photometry.'})
   url=archive_rows[index]['source_url']; product=url.rsplit('/',1)[-1]
   observations.append({'id':name,'classification':'Observed','label':ih['DATE-OBS'][:10], 'observedAt':ih['DATE-OBS']+'Z','mjd':float(ih['MJD-OBS']),'timeScale':ih['TIMESYS'],'dimensions':[47,47],
    'source':{'path':source.name,'sha256':sha,'byteLength':len(payload),'archiveUrl':url,'archiveProductId':product,'archiveRelease':'SPHEREx Quick Release 2 (qr2 path); prior package folder SPHEREx-D2','pipelineVersion':h[0].header.get('VERSION'),'archiveOriginStatus':'Official IRSA URL recorded in prior acquisition metadata; no new download or online revalidation','priorOrigin':prior[index].get('origin'),'digestScope':'Local preserved IRSA cutout FITS bytes; not the checksum of the linked full-frame parent archive product','priorChecksumMatch':True,'archiveTableRow':index},
    'units':{'image':ih.get('BUNIT'),'variance':h['VARIANCE'].header.get('BUNIT'),'flags':'dimensionless'},
    'wavelength':{'approximateUm':prior[index]['wavelength_um'],'classification':'Unavailable or unverified','source':'Prior WCS-WAVE target-center visualization lookup','scientificCalibration':False,'note':'Approximate display label only; no scientific spectral matching.'},
    'calibration':{'classification':'Unavailable or unverified','responseValidated':False,'calibrationVersion':None,'recordedReferencesClassification':'Observed','recordedReferences':[str(v) for v in ih.get('HISTORY',[]) if '[CALIB]' in str(v)],'pipelineVersion':h[0].header.get('VERSION'),'note':'Pipeline version is preserved; independent calibration reference files are unavailable.'},
    'wcs':{'classification':'Observed','status':'Native primary celestial WCS from IMAGE header; no cross-epoch registration','ctype':[ih['CTYPE1'],ih['CTYPE2']],'frame':ih['RADESYS'],'sipOrder':[ih['A_ORDER'],ih['B_ORDER']],'headerPath':'investigations/rdra-v1/'+hp.name,'sky':assets['sky'],'pixelScaleArcsec':list(map(float,proj_plane_pixel_scales(w)*3600)),'roundTripMaxPixels':residual,'targetPixel':[tx,ty],'finast':ih.get('FINAST'),'finastComment':ih.comments['FINAST'],'finastInterpretation':'0 = good fine-astrometric solution in product header; does not certify cross-epoch registration','documentationUrl':'https://irsa.ipac.caltech.edu/data/SPHEREx/docs/SPHEREx_Expsupp_QR.pdf'},
    'assets':assets,'render':{'classification':'Processed','method':'Independent per-observation asinh grayscale using accepted pixels only','percentiles':[2,99.5],'min':lo,'max':hi,'asinhSoftening':8,'pixelOrigin':'Zero based x right, y up; binary rows increase native FITS y','pngOrientation':'Native detector orientation with vertical flip so PNG top row corresponds to highest FITS y; not north-up','interpolation':'none','nativeSize':[47,47],'maskedPixels':'Transparent in preview over a black background; amber in optional quality overlay; never filled','maskEncoding':{'0':'accepted','1':'excluded'}},
    'quality':{'classification':'Processed','maskPolicy':'Accept finite IMAGE and finite strictly positive VARIANCE with all FLAGS bits clear except MP_SOURCE=21; other bits conservatively excluded. No core filling.','totalPixels':int(a.size),'finiteImagePixels':int(np.isfinite(a).sum()),'validPixels':int(valid.sum()),'excludedPixels':int(mask.sum()),'zeroVariancePixels':int((v==0).sum()),'nonfiniteImagePixels':int((~np.isfinite(a)).sum()),'flagDefinitions':bits,'bitCounts':{k:int(((f&(1<<b['bit']))!=0).sum()) for k,b in bits.items()},'sourceCore':{'radiusPixels':2.5,'totalPixels':int(core.sum()),'acceptedPixels':int((core&valid).sum()),'excludedPixels':int((core&~valid).sum()),'nonfinitePixels':int((core&~np.isfinite(a)).sum()),'note':'Search-coordinate core only; not independently confirmed source identity. Bright finite core pixels carry overflow flags; calibrated surface brightness alone cannot diagnose detector saturation.'},'psfExtensionShape':list(h['PSF'].data.shape),'psfValidated':False},'referencePixels':samples})
   tests.append({'observation':name,'checksumMatch':True,'requiredExtensions':True,'dimensionalConsistency':True,'nativeWcsRoundTripMaxPixels':residual,'bufferRoundTrip':True,'coreExcluded':int((core&~valid).sum())})
   for key,arr in [('image',a),('variance',v),('flags',f),('mask',mask),('sky',sky)]:
    loaded=np.fromfile(args.output/Path(assets[key]['path']).name,dtype=arr.dtype).reshape(arr.shape); assert np.array_equal(loaded,arr,equal_nan=True)
  assert digest(source.read_bytes())==sha, 'Source changed during preparation'
 manifest={'schemaVersion':'parallax.investigation.v1','id':'rdra-v1','title':'R Draconis: the missing core','classification':'Observed','target':{'name':'R Draconis search field','raDeg':CENTER[0],'decDeg':CENTER[1],'frame':'ICRS','identityStatus':'Search coordinates from prior research; source identity not independently verified'},'summary':'Two authentic SPHEREx observations reveal why a bright source requires caution: the central pixels are missing or flagged.','observations':observations,'comparison':{'classification':'Unavailable or unverified','registered':False,'blink':False,'difference':False,'photometry':False,'motion':False,'sideBySide':True,'baselineDays':abs(observations[1]['mjd']-observations[0]['mjd']),'gates':{k:{'passed':False,'reason':v} for k,v in REASONS.items()}},'conclusion':{'classification':'Processed','status':'QUALITY_WARNING','headline':'The core cannot support a reliable brightness comparison.','detail':'Both native cutouts contain missing or flagged pixels at the search-coordinate core. These observations support inspecting data quality, not a variability, motion or discovery claim.','alternatives':['Instrumental overflow and onboard processing errors','Missing core data','Unvalidated registration, wavelength response and PSF differences']},'processing':{'classification':'Processed','script':'scripts/prepare_rdra.py','networkUsed':False,'reprojected':False,'syntheticData':False,'originalFilesModified':False,'byteOrder':'little-endian','uncertainty':'Accepted native pixels expose sqrt(VARIANCE) only; zero/nonfinite variance is excluded, not zero error. No aperture photometry or cross-epoch significance.'}}
 dump(args.output/'manifest.json',manifest)
 report={'status':'PASS_OFFLINE_SLICE_PREPARATION','tests':tests,'observations':2,'assets':sum(len(o['assets']) for o in observations),'scienceCapabilities':{'nativeInspection':True,'decodedHeaderFlags':True,'nativeWcsCoordinateReadout':True,'registeredComparison':False,'difference':False,'motion':False,'photometry':False},'blockedReasons':REASONS,'sourceArchiveSha256':archive_sha,'fullAcquisitionArchiveRechecked':args.archive is not None,'acquisitionMetadataMode':'historical archive checked' if args.archive else 'bundled curated real-observation metadata subset'}
 dump(args.report,report)
 print(json.dumps(report,indent=2))
if __name__=='__main__': main()
