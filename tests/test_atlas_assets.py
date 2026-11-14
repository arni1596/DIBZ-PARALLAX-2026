from pathlib import Path
import json,unittest,hashlib,subprocess,tempfile,sys,os
import numpy as np
from astropy.io import fits
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];O=ROOT/'public/investigations/atlas-v1';M=json.loads((O/'manifest.json').read_text(encoding='utf-8'));RECORDS=Path(os.environ.get('PARALLAX_ATLAS_RECORDS',str(ROOT/'.local-data/atlas/observation-evidence.json')));R={x['product_id']:x for x in json.loads(RECORDS.read_text())}
class AtlasAssets(unittest.TestCase):
 def test_exact_original_samples_and_unchanged_source(self):
  for o in M['observations']:
   r=R[o['id']];p=Path(r['path']);self.assertEqual(hashlib.sha256(p.read_bytes()).hexdigest(),r['sha256'])
   with fits.open(p,mode='readonly') as h:
    (y0,y1),(x0,x1)=r['roi_source_bounds_yx']
    for k,dtype in [('IMAGE','<f4'),('VARIANCE','<f4'),('FLAGS','<u4')]:np.testing.assert_array_equal(np.fromfile(ROOT/'public'/o['assets'][k.lower()]['path'],dtype=dtype).reshape(117,117),h[k].data[y0:y1,x0:x1])
 def test_PNG_mask_and_real_pixel_transform(self):
  for o in M['observations']:
   read=lambda k,dt:np.fromfile(ROOT/'public'/o['assets'][k]['path'],dtype=dt).reshape(117,117)
   a=read('image','<f4');m=read('mask','u1');rgba=np.array(Image.open(ROOT/'public'/o['assets']['preview']['path']))[::-1];np.testing.assert_array_equal(rgba[:,:,3],m*255)
   low,high=o['render']['low'],o['render']['high'];expected=np.zeros(a.shape);good=m==1;expected[good]=np.arcsinh(8*np.clip((a[good]-low)/(high-low),0,1))/np.arcsinh(8);np.testing.assert_array_equal(rgba[:,:,0],(expected*255).round().astype('u1'))
 def test_offline_reproduction_all_assets(self):
  with tempfile.TemporaryDirectory() as t:
   subprocess.run([sys.executable,str(ROOT/'scripts/prepare_atlas.py'),'--output',t,'--records',str(RECORDS)],check=True,capture_output=True)
   for p in O.iterdir():self.assertEqual(hashlib.sha256(p.read_bytes()).hexdigest(),hashlib.sha256((Path(t)/p.name).read_bytes()).hexdigest(),p.name)
if __name__=='__main__':unittest.main(verbosity=2)
