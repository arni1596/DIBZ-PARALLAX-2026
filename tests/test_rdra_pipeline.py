"""Malformed test copies are negative fixtures, never display observations."""
import sys,unittest,tempfile,subprocess,hashlib
from pathlib import Path
import numpy as np
from astropy.io import fits
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from check_rdra import validate_hdus,check,InvestigationInputError,ROOT
class RdraPipelineTests(unittest.TestCase):
 def make_copy(self):
  with fits.open(ROOT/'tests/fixtures/rdra/rdra_row_0001.fits',memmap=False) as h:return fits.HDUList([e.copy() for e in h])
 def test_real_slice_roundtrip_and_quality(self):self.assertEqual(check()['status'],'PASS')
 def test_preparation_reproduces_versioned_assets_offline(self):
  work=ROOT/'.test-work';work.mkdir(exist_ok=True)
  with tempfile.TemporaryDirectory(dir=work,prefix='rdra-') as temp:
   out=Path(temp);self.assertTrue(out.resolve().is_relative_to(work.resolve()))
   subprocess.run([sys.executable,str(ROOT/'scripts/prepare_rdra.py'),'--output',str(out),'--report',str(out/'processing.json')],check=True,capture_output=True,text=True)
   for source in (ROOT/'public/investigations/rdra-v1').iterdir():self.assertEqual(hashlib.sha256(source.read_bytes()).digest(),hashlib.sha256((out/source.name).read_bytes()).digest(),source.name)
 def test_missing_flags_fails(self):
  h=self.make_copy();del h['FLAGS']
  with self.assertRaisesRegex(InvestigationInputError,'FLAGS'):validate_hdus(h)
 def test_variance_shape_fails(self):
  h=self.make_copy();h['VARIANCE'].data=np.ones((2,2),dtype='f4')
  with self.assertRaisesRegex(InvestigationInputError,'dimensions'):validate_hdus(h)
 def test_noninteger_flags_fail(self):
  h=self.make_copy();h['FLAGS'].data=h['FLAGS'].data.astype('f4')
  with self.assertRaisesRegex(InvestigationInputError,'integer'):validate_hdus(h)
 def test_missing_timestamp_fails(self):
  h=self.make_copy();del h['IMAGE'].header['DATE-OBS']
  with self.assertRaisesRegex(InvestigationInputError,'identity'):validate_hdus(h)
 def test_wrong_units_fail(self):
  h=self.make_copy();h['IMAGE'].header['BUNIT']='counts'
  with self.assertRaisesRegex(InvestigationInputError,'units'):validate_hdus(h)
if __name__=='__main__':unittest.main(verbosity=2)
