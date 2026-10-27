from pathlib import Path
import json,re,subprocess,hashlib,ast
repo=Path.cwd()
log=Path('/Users/toko/.codex/sessions/2026/10/19/rollout-2026-10-19T20-43-08-01a1550b-a2ea-7c52-aa87-7bc3c67e8529.jsonl').read_text().splitlines()
def call(n):
 p=json.loads(log[n])['payload'];return p.get('arguments',p.get('input',''))
def patch(n):
 s=call(n)
 if s.startswith('*** Begin Patch'):return s
 pos=s.index('tools.apply_patch(')+len('tools.apply_patch(')
 return json.JSONDecoder().raw_decode(s[pos:])[0]
def apply(s,p):
 ls=p.splitlines()
 if ls[1].startswith('*** Add File:'):
  return '\n'.join(l[1:] for l in ls[2:-1])+'\n'
 chunks=[];chunk=[]
 for l in ls[2:]:
  if l.startswith('@@') or l=='*** End Patch':
   if chunk:chunks.append(chunk);chunk=[]
  else:chunk.append(l)
 for c in chunks:
  old='\n'.join(l[1:] for l in c if l[0] in ' -')+'\n'
  new='\n'.join(l[1:] for l in c if l[0] in ' +')+'\n'
  assert s.count(old)==1,('patch context count',s.count(old),old[:130])
  s=s.replace(old,new,1)
 return s
original=json.loads(Path('output/hospitals-polish/copy-source.json').read_text())
html=subprocess.check_output(['git','show','HEAD:public/hospitals.html']).decode()
assert hashlib.sha256(html.encode()).hexdigest()==original['sha256']
edits=json.loads(Path('output/hospitals-polish/copy-edits.json').read_text())
for e in sorted(edits,key=lambda e:original['units'][e['id']]['start'],reverse=True):
 u=original['units'][e['id']];assert html[u['start']:u['end']]==u['html']
 html=html[:u['start']]+e['html']+html[u['end']:]
html=apply(html,patch(1054));html=apply(html,patch(1091))
for a,b in {
'მკურნალობა, ლაბორატორია, გამოსახულებები და მართვა ერთ ოპერაციულ სისტემაში.':'მკურნალობა, ლაბორატორია, რადიოლოგია და მართვა ერთ ოპერაციულ სისტემაში.',
'ვიზიტის დრო, განმეორებითი შეყვანა, ანგარიშში გამორჩენილი მომსახურება — წინასწარ შეთანხმებული საზომებით.':'ვიზიტის ხანგრძლივობას, მონაცემების ხელახალ შეყვანასა და ანგარიშში გამორჩენილ მომსახურებას საწყის მაჩვენებლებს ვადარებთ.',
'დიაგნოსტიკის ერთ-ერთი მნიშვნელოვანი მინიშნება <strong>დაახლოებით $20-იანი ლიპაზის ანალიზი</strong> იყო.':'დიაგნოზის დასმაში მნიშვნელოვანი როლი შეასრულა <strong>დაახლოებით $20-იანმა ლიპაზის ანალიზმა</strong>.'}.items():
 assert html.count(a)==1;html=html.replace(a,b,1)
css=''
for n in [795,876,947,1130,1149,1178]:css=apply(css,patch(n))
# The rewrite did not edit anything before the first slide or after the last slide.
current=Path('public/hospitals.html').read_text()
html=current[:current.index('<section')]+html[html.index('<section'):]
validation=json.loads(Path('output/hospitals-polish/validation.json').read_text())
for path,content in [('public/hospitals.html',html),('public/deck-assets/hospitals-polish.css',css)]:
 assert hashlib.sha256(content.encode()).hexdigest()==validation['files'][path],('Prior polish hash mismatch',path)
print('Exact prior-polish HTML and CSS hashes verified.')
# Reapply only the earlier, user-requested comparison and offer fixes.
cmd=json.loads(call(1342))['cmd'];py=cmd.split("python3 <<'PY'\n",1)[1].rsplit('\nPY',1)[0]
tree=ast.parse(py)
replacements=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='replacements' for t in n.targets))
a=html.index('<section class="gw-slide hxr-slide hxr3-slide">');b=html.index('</section>',a);part=html[a:b]
for old,new in replacements.items():
 assert part.count(old)==1;part=part.replace(old,new)
notes=next(n.value for n in ast.walk(tree) if isinstance(n,ast.Constant) and isinstance(n.value,str) and n.value.startswith('        <aside class="notes">\n'))
part=part[:part.index('        <aside class="notes">')]+notes
html=html[:a]+part+html[b:]
html=html.replace('SLIDE 2 · LEGACY EMR IS A TICKING BOMB (loss-framing, dark/red)','SLIDE 2 · CURRENT SETUP VS MEDIMIND — paired practical differences',1)
html=apply(html,patch(1397));css=apply(css,patch(1358))
assert len(re.findall(r'<section\b',html))==17
assert 'hjb-' not in html and 'hjb-' not in css
Path('public/hospitals.html').write_text(html)
Path('public/deck-assets/hospitals-polish.css').write_text(css)
print('Restored 17-slide version from before the Justina rewrite, retaining both requested fixes.')