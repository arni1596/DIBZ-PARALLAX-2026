"""Independent offline validation of the curated observed FITS and generated assets."""
from pathlib import Path
import hashlib,json
import numpy as np
from astropy.io import fits
from astropy.wcs import WCS
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=('IMAGE','VARIANCE','FLAGS','PSF','WCS-WAVE')
class InvestigationInputError(ValueError):pass

def validate_hdus(hdus):
 for name in REQUIRED:
  if name not in hdus:raise InvestigationInputError(f'Required extension missing: {name}')
 im,va,fl=(hdus[n].data for n in ('IMAGE','VARIANCE','FLAGS'))
 if im.ndim!=2 or im.shape!=va.shape or im.shape!=fl.shape:raise InvestigationInputError('IMAGE, VARIANCE and FLAGS dimensions disagree')
 if not np.issubdtype(fl.dtype,np.integer):raise InvestigationInputError('FLAGS must contain integer bit masks')
 if hdus['IMAGE'].header.get('BUNIT','').replace(' ','')!='MJy/sr':raise InvestigationInputError('Unsupported IMAGE units')
 if not all(k in hdus['IMAGE'].header for k in ('DATE-OBS','MJD-OBS','OBSID','CTYPE1','CTYPE2')):raise InvestigationInputError('Missing observation or WCS identity')
 return im,va,fl

def check():
 manifest=json.loads((ROOT/'public/investigations/rdra-v1/manifest.json').read_text());results=[]
 for o in manifest['observations']:
  path=ROOT/'tests/fixtures/rdra'/o['source']['path'];sha=hashlib.sha256(path.read_bytes()).hexdigest()
  assert sha==o['source']['sha256'],'Original curated source checksum mismatch'
  with fits.open(path,mode='readonly',memmap=False) as h:
   im,va,fl=validate_hdus(h);valid=np.isfinite(im)&np.isfinite(va)&(va>0)&((fl.astype(np.uint32)&np.uint32(0xffffffff^(1<<21)))==0)
   hdr=h['IMAGE'].header;assert hdr['DATE-OBS']+'Z'==o['observedAt'];assert list(im.shape)==o['dimensions']
   for key,arr,dtype in [('image',im,'<f4'),('variance',va,'<f4'),('flags',fl,'<u4'),('mask',~valid,'u1')]:
    a=o['assets'][key];b=(ROOT/'public'/a['path']).read_bytes();assert hashlib.sha256(b).hexdigest()==a['sha256'];got=np.frombuffer(b,dtype=dtype).reshape(im.shape)
    assert np.array_equal(got,np.asarray(arr,dtype=dtype),equal_nan=True),key
   w=WCS(hdr,h).celestial;assert w.sip is not None;y,x=np.indices(im.shape);ra,dec=w.all_pix2world(x,y,0)
   sky=np.fromfile(ROOT/'public'/o['assets']['sky']['path'],dtype='<f8').reshape(*im.shape,2)
   assert np.allclose(sky[:,:,0],ra,rtol=0,atol=1e-9) and np.allclose(sky[:,:,1],dec,rtol=0,atol=1e-9)
   # Tolerance checks numerical WCS serialization only, never independent astrometric accuracy.
   rgba=np.asarray(Image.open(ROOT/'public'/o['assets']['preview']['path']).convert('RGBA'))
   assert np.array_equal(rgba[:,:,3],np.flipud(valid).astype('uint8')*255)
   r=o['render'];v=np.clip((im-r['min'])/(r['max']-r['min']),0,1);gray=np.uint8(np.round(np.nan_to_num(255*np.arcsinh(v*r['asinhSoftening'])/np.arcsinh(r['asinhSoftening']))))
   assert np.array_equal(rgba[:,:,0][np.flipud(valid)],np.flipud(gray)[np.flipud(valid)])
   assert valid.sum()==o['quality']['validPixels'];assert not valid[23,23]
   results.append({'id':o['id'],'source_sha256':sha,'native_pixels':int(im.size),'accepted_pixels':int(valid.sum()),'core_measurement_available':False,'all_native_arrays_and_preview_alpha_match':True,'primary_sip_retained':True})
  assert hashlib.sha256(path.read_bytes()).hexdigest()==sha
 return {'status':'PASS','input_kind':'Observed curated IRSA FITS cutouts','checks':results,'calibrated_wavelength_or_cross_epoch_registration_validated':False}
if __name__=='__main__':
 result=check();(ROOT/'rdra_validation_results.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result,indent=2))

