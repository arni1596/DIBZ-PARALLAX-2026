"""Import the accepted ZIP verbatim. Does not generate or alter scientific data."""
import argparse,hashlib,json,zipfile
from pathlib import Path
HERE=Path(__file__).resolve().parent
EXPECTED_ARCHIVE='840dfc08cd7f69a03b8ab028a4ae01bda1bf883ea3eb04c9ac5fdee5f7fcdb03'
EXPECTED_VERIFICATION='15acc5fd8a06dc98b4572dbd74e5f06ea6893a98ac8f93e46c8f19683f44e3c0'
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--archive',type=Path,default=HERE.parent/'PARALLAX-M101-readiness-102.zip');args=ap.parse_args()
    content=args.archive.read_bytes()
    if hashlib.sha256(content).hexdigest()!=EXPECTED_ARCHIVE: raise ValueError('Archive SHA-256 differs from accepted source; no files imported')
    with zipfile.ZipFile(args.archive) as z:
        prefix='readiness_102/dataset/'; verification=z.read(prefix+'verification_results.json')
        if hashlib.sha256(verification).hexdigest()!=EXPECTED_VERIFICATION: raise ValueError('Verification record differs from accepted source')
        record=json.loads(verification)
        for rel,sha in record['artifact_sha256'].items():
            if hashlib.sha256(z.read(prefix+rel)).hexdigest()!=sha: raise ValueError('Archive artifact integrity failed: '+rel)
        output=HERE/'public'/'dataset'
        for item in z.infolist():
            if item.filename.startswith(prefix) and not item.is_dir():
                rel=Path(item.filename[len(prefix):])
                if '..' in rel.parts or rel.is_absolute(): raise ValueError('Unsafe archive path')
                path=output/rel;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(z.read(item))
    print('Imported accepted dataset bytes only. No regeneration or observation downloads.')
if __name__=='__main__':main()
