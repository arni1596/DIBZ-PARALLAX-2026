"""Reproducible offline FITS -> grayscale PNG + browser metadata. Inputs read-only."""
import argparse
import csv
import hashlib
import json
import struct
import zlib
from pathlib import Path
import numpy as np
from astropy.io import fits

HERE=Path(__file__).resolve().parent
DEFAULT_FITS=HERE/'.local-data'/'spectral-inventory'

def digest(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for b in iter(lambda:f.read(1048576),b''): h.update(b)
    return h.hexdigest()

def write_json(path,value):
    path.write_text(json.dumps(value,indent=2,allow_nan=False)+'\n',encoding='utf-8')

def grayscale_png(image,low,high):
    """8-bit grayscale + alpha; reverse rows for lower-origin FITS display."""
    if not np.isfinite(low+high) or high<=low: raise ValueError('Invalid display range')
    valid=np.isfinite(image)
    scaled=np.rint(np.clip((np.where(valid,image,low)-low)/(high-low),0,1)*255).astype('uint8')
    pixels=np.stack([scaled,valid.astype('uint8')*255],axis=-1)[::-1]
    raw=b''.join(b'\x00'+row.tobytes() for row in pixels)
    def chunk(kind,data):
        return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
    height,width=image.shape
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',width,height,8,4,0,0,0))+chunk(b'IDAT',zlib.compress(raw,9))+chunk(b'IEND',b'')

def decode(value):
    if value=='True': return True
    if value=='False': return False
    if value=='': return None
    try: return json.loads(value)
    except (ValueError,TypeError): return value

def csv_records(path):
    with path.open(newline='',encoding='utf-8-sig') as f:
        return [{k:decode(v) for k,v in row.items()} for row in csv.DictReader(f)]

def channel_states(channels,observations):
    return [{**c,'observation_indices':[i for i,o in enumerate(observations) if o.get('global_channel')==c['global_channel'] and o.get('asset')]} for c in channels]

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--fits-dir',type=Path,default=DEFAULT_FITS)
    ap.add_argument('--audit-dir',type=Path,default=HERE.parent)
    ap.add_argument('--output',type=Path,default=HERE/'public'/'data')
    a=ap.parse_args(); out=a.output.resolve(); source=a.fits_dir.resolve(); audit=a.audit_dir.resolve()
    if out==source or source in out.parents: ap.error('Output must be separate from original FITS directory')
    out.mkdir(parents=True,exist_ok=True)
    rows=csv_records(audit/'observations_11.csv'); channels=csv_records(audit/'channel_coverage_102.csv')
    if len(rows)!=11 or len(channels)!=102: raise ValueError('Expected completed 11-observation, 102-definition audit')
    if len({c['global_channel'] for c in channels})!=102: raise ValueError('Duplicate channel definitions')
    originals={}; observations=[]
    for record in rows:
        name=record['filename']
        if Path(name).name!=name: raise ValueError('Unsafe input filename')
        path=source/name; originals[name]=digest(path)
        if originals[name]!=record['sha256']: raise ValueError('FITS hash disagrees with audit: '+name)
        if not record['CHANNEL_ASSIGNED_PROVISIONAL'] or record['FAILED_CHANNEL_LOOKUP']: raise ValueError('Rejected audit assignment: '+name)
        with fits.open(path,mode='readonly',memmap=False) as h:
            image=np.asarray(h['IMAGE'].data,dtype=float)
            if image.ndim!=2 or list(image.shape[::-1])!=record['image_dimensions_xy']: raise ValueError('IMAGE shape disagrees with audit')
            if int(h['IMAGE'].header['DETECTOR'])!=record['detector']: raise ValueError('Detector disagrees with audit')
            finite=image[np.isfinite(image)]
            if finite.size==0: raise ValueError('No finite image pixels: '+name)
            low,high=np.percentile(finite,[1,99]).tolist()
            if high<=low: low=float(finite.min()); high=low+max(abs(low)*1e-6,1e-6)
            asset=name.replace('.fits','.png'); png=grayscale_png(image,low,high); (out/asset).write_bytes(png)
            pixels=name.replace('.fits','.pixels.json')
            write_json(out/pixels,{'values':[[float(v) if np.isfinite(v) else None for v in row] for row in image],'unit':h['IMAGE'].header.get('BUNIT'),'origin':'Original FITS array, values[y][x], zero-based, y increases upward in viewer'})
            flag_data=h['FLAGS'].data if 'FLAGS' in h else None
            observations.append({**record,'asset':'data/'+asset,'pixels_asset':'data/'+pixels,'asset_sha256':hashlib.sha256(png).hexdigest(),'unit':h['IMAGE'].header.get('BUNIT'),'display':{'method':'Linear grayscale, per-image 1st to 99th percentile; clipped for display only','low':low,'high':high,'bit_depth':8,'origin':'FITS lower origin: original row 0 displayed at bottom','resampling':'None; browser nearest-neighbor pixel enlargement','not_north_up':True,'finite_pixels':int(finite.size),'nonfinite_pixels':int(image.size-finite.size),'source_min':float(finite.min()),'source_max':float(finite.max()),'clipped_pixels':int(np.count_nonzero(np.isfinite(image)&((image<low)|(image>high))))},'flags_summary':{'available':flag_data is not None,'nonzero_pixels':int(np.count_nonzero(flag_data)) if flag_data is not None else None,'interpretation':'Raw flag values preserved in audit; science acceptance criteria not assessed'},'time_comparison':{'available':False,'reason':'No second observation of this nominal channel. Cross-channel images have different spectral responses; common target coordinates do not demonstrate pixel registration. No validated same-band, registered pair is available.'}})
    after={name:digest(source/name) for name in originals}
    if originals!=after: raise RuntimeError('Original input hash changed')
    metadata_sources={name:digest(audit/name) for name in ['observations_11.csv','channel_coverage_102.csv','validation_report.json','calibration_provenance.json']}
    for name in metadata_sources: (out/name).write_bytes((audit/name).read_bytes())
    manifest={'schema_version':1,'target':{'name':'M101','description':'Pinwheel Galaxy field','ra_deg':rows[0]['reference_ra_dec_deg'][0],'dec_deg':rows[0]['reference_ra_dec_deg'][1],'identity_note':'Saved reference position; target identity not independently verified'},'observations':observations,'channels':channel_states(channels,observations),'processing':{'script':'preprocess.py','script_sha256':digest(Path(__file__)),'fits_source_directory':str(source),'audit_directory':str(audit),'audit_file_sha256':metadata_sources,'original_sha256_before':originals,'original_sha256_after':after,'originals_unchanged':True,'network_requests':0,'display_only':True,'limitations':['Images are measured IMAGE data with grayscale display normalization, not calibrated photometry.','Channel and wavelength apply at the saved M101 reference pixel; wavelength varies across an LVF detector image.','Shared field coordinates do not establish image registration.','All channel assignments are provisional; calibration UUID linkage remains unverified.','Nine observations have no matching external CWAVE/CBAND calibration.','No scientifically verified 102-channel coverage.']}}
    write_json(out/'manifest.json',manifest)
    print(json.dumps({'observations':len(observations),'channel_definitions':len(channels),'enabled_channels':sum(bool(c['observation_indices']) for c in manifest['channels']),'originals_unchanged':True,'output':str(out)},indent=2))
if __name__=='__main__': main()
