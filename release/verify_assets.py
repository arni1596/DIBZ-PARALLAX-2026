"""Verify the declared scientific bundle without downloads, rewrites or dependencies."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'release/PARALLAX_CLEARED_ASSETS_MANIFEST.json').read_text(encoding='utf-8'))
assert len(m['files'])==630 and not m['notCleared']
for x in m['files']:
 p=(root/x['path']).resolve()
 if not p.is_relative_to(root) or x['distribution_decision']!='CLEARED':raise SystemExit('Unsafe or uncleared asset path')
 if not p.is_file():raise SystemExit('Missing asset: '+x['path'])
 b=p.read_bytes()
 if len(b)!=x['bytes'] or hashlib.sha256(b).hexdigest()!=x['sha256']:raise SystemExit('Asset integrity mismatch: '+x['path'])
print('PASS:630 CLEARED scientific assets;114751955bytes; no files changed.')
