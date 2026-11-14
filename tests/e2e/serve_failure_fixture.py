"""Negative browser-test server: a real asset request fails; no synthetic image."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import argparse
root=Path(__file__).resolve().parents[2]/'dist'
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root),**kwargs)
 def do_GET(self):
  if self.path.endswith('/rdra_row_0001.image.f32'):self.send_error(404,'Deliberately missing numerical asset for negative test')
  else:super().do_GET()
p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=5174);a=p.parse_args();print(f'Failure-test URL: http://127.0.0.1:{a.port}/',flush=True);ThreadingHTTPServer(('127.0.0.1',a.port),Handler).serve_forever()
