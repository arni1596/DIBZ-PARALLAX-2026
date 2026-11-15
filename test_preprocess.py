import unittest
import struct
import zlib
import numpy as np
import preprocess as p
class PreprocessTests(unittest.TestCase):
    def test_png_contains_measured_pixels_and_transparency(self):
        image=np.array([[0.,1.],[2.,np.nan]])
        png=p.grayscale_png(image,0.,2.)
        self.assertEqual(png[:8],b'\x89PNG\r\n\x1a\n')
        pos=8; data=b''
        while pos<len(png):
            n=struct.unpack('>I',png[pos:pos+4])[0]; kind=png[pos+4:pos+8]
            if kind==b'IDAT': data+=png[pos+8:pos+8+n]
            pos+=12+n
        self.assertEqual(zlib.decompress(data),bytes([0,255,255,0,0,0,0,255,128,255]))
    def test_unavailable_channels_not_enabled(self):
        channels=[{'global_channel':1},{'global_channel':2}]
        result=p.channel_states(channels,[{'global_channel':1,'asset':'real.png'}])
        self.assertEqual(result[0]['observation_indices'],[0])
        self.assertEqual(result[1]['observation_indices'],[])
if __name__=='__main__': unittest.main()
