from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
from urllib.request import urlopen,Request
import json,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.ids=set();self.refs=[];self.duplicates=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:
   if a['id'] in self.ids:self.duplicates.append(a['id'])
   self.ids.add(a['id'])
  if tag in ('script','img','link','a'):
   v=a.get('src') or a.get('href')
   if v:self.refs.append(v)
results=[]
for f in ROOT.rglob('*.html'):
 p=Parser();p.feed(f.read_text());assert not p.duplicates,(f,p.duplicates)
 for ref in p.refs:
  u=urlsplit(ref)
  if u.scheme or ref.startswith('#'):continue
  target=(f.parent/u.path).resolve()
  if u.path.endswith('/'):target=target/'index.html'
  assert target.exists(),(f,ref)
 results.append(f'{f.relative_to(ROOT)}: IDs uniques et fichiers liés présents')
for f in (ROOT/'assets').glob('*.svg'):ET.parse(f)
results.append('SVG : XML valide')
for route in ('/','/admin/','/style.css','/site.js','/config.js','/admin/admin.js','/assets/automobile.svg','/docs/sources.html'):
 with urlopen('http://localhost:8817'+route) as r:
  assert r.status==200
  assert r.headers['X-Content-Type-Options']=='nosniff'
  assert "object-src 'none'" in r.headers['Content-Security-Policy']
results.append('8 routes statiques HTTP 200 ; en-têtes CSP/nosniff présents')
css=(ROOT/'style.css').read_text();assert 'prefers-reduced-motion:reduce' in css and '@media(max-width:760px)' in css
results.append('Règles mobile et mouvement réduit présentes (contrôle statique, pas test visuel)')
report={'scope':'Static files and local HTTP server, NOT visual browser testing','results':results,'passed':len(results),'webBytes':sum(p.stat().st_size for p in ROOT.rglob('*') if p.is_file() and p.suffix in ('.html','.js','.css','.svg'))}
(ROOT/'tests/static-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
