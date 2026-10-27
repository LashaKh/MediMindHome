import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'working/manifest.json'),'utf8'));
const errors=[];
const warnings=[];
const rows=[];
const words=s=>s.trim().split(/\s+/).filter(Boolean).length;
const load=file=>fs.existsSync(path.join(root,'outputs',file))?fs.readFileSync(path.join(root,'outputs',file),'utf8'):'';
for(const m of manifest){
  const text=load(m.file);
  if(!text){errors.push(m.id+': missing output');continue;}
  const headings=[...text.matchAll(/^## ((?:Step|Part|Section)\s+\d+[^\n]*)/gm)].map(x=>x[1]);
  if(headings.length!==m.sections)errors.push(`${m.id}: expected ${m.sections} top-level required sections, found ${headings.length}`);
  if(m.id.startsWith('p1-')||m.id.startsWith('l0-')){
    const nums=headings.map(h=>Number(h.match(/\d+/)[0]));
    if(nums.some((n,i)=>n!==i+1))errors.push(m.id+': section sequence wrong');
  }
  if(/turn\d+(?:search|view)|cite|\b(?:TODO|TBD)\b|lorem ipsum/i.test(text))errors.push(m.id+': unresolved artifact token');
  const placeholders=[...text.matchAll(/\[PLACEHOLDER[^\]]*\]/g)].map(x=>x[0]);
  rows.push({...m,words:words(text),headings,placeholderCount:placeholders.length});
}
function section(text,kind,num){const re=new RegExp('^## '+kind+' '+num+'[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))','m');return text.match(re)?.[1]||'';}
function assertCount(n,want,label){if(n!==want)errors.push(`${label}: ${n}, expected ${want}`);}
const uvps=load('p1-04-uvps.md');
if(uvps)assertCount((section(uvps,'Step',3).match(/^\d+\. /gm)||[]).length,10,'10 UVPs');
const interview=load('p1-07-user-research.md');
if(interview){
  assertCount((section(interview,'Step',7).match(/^\d+\. /gm)||[]).length,15,'Tailored interview questions');
  assertCount((section(interview,'Step',8).match(/^\*\*(?:LinkedIn message|Email|Community\/forum message)\./gm)||[]).length,9,'Outreach templates');
}
const avatar=load('p1-09-avatar.md');
if(avatar){const quote=section(avatar,'Step',3).split('\n').filter(l=>l.startsWith('>')).join(' ').replace(/>\s*/g,'');const n=words(quote);if(n<150||n>200)errors.push(`Avatar monologue ${n} words, expected150–200`);}
const description=load('p1-02-mechanics-jtbd.md');
if(description){const q=section(description,'Step',6).split('\n').filter(l=>l.startsWith('>')).join(' ').replace(/>\s*/g,'');if(words(q)>150)errors.push('Product description exceeds150words');}
const campaign=load('p2-03b-campaign-distribution.md');
if(campaign){
  assertCount((campaign.match(/^### Email [1-4] /gm)||[]).length,4,'Campaign emails');
  const postRows=section(campaign,'Part',3).split('\n').filter(l=>/^\| \*\*\d+ \//.test(l));
  assertCount(postRows.length,10,'Full campaign posts');
  const days=postRows.map(l=>Number(l.match(/\d+/)[0]));
  if(JSON.stringify(days)!==JSON.stringify([1,2,4,5,7,8,9,11,12,14]))errors.push('Campaign post days differ from source prompt');
  const emailChunks=campaign.split(/^### Email /m).slice(1);
  for(const chunk of emailChunks){
    const num=Number(chunk[0]);
    const subject=chunk.match(/\*\*Subject:\*\* ([^\n]+)/)?.[1]||'';
    const preview=chunk.match(/\*\*Preview:\*\* ([^\n]+)/)?.[1].trim()||'';
    if(words(subject)>8)errors.push(`Email${num} subject over8words`);
    if(preview.length>40)errors.push(`Email${num} preview over40characters`);
    const body=chunk.split('**Full body:**')[1]?.split('**CTA link text:**')[0].split('**Soft CTA link text:**')[0]||'';
    const clean=body.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*_]/g,'');
    if(words(clean)>(num===4?100:150))errors.push(`Email${num} body overlimit:${words(clean)}`);
  }
}
const traffic=load('p2-05-traffic.md');
if(traffic)assertCount(section(traffic,'Part',1).split('\n').filter(l=>l.startsWith('|')&&!/^\|[- ]/.test(l.replace(/^\| /,'|'))).length-1,36,'Traffic channel rows');
const reporting=load('p2-07-reporting.md');
if(reporting){
  assertCount((section(reporting,'Part',1).match(/^### Section [1-3] /gm)||[]).length,3,'Weekly report sections');
  assertCount((section(reporting,'Part',4).match(/^\| \d+[^|]*\|/gm)||[]).length,13,'North star weeks');
}
for(const [file,headline,cta] of [['l0-01-demo.md',1,4],['l0-02-webinar.md',1,4],['l0-03-trial.md',1,3]]){
  const t=load(file);if(!t)continue;
  for(const n of [headline,cta])assertCount((section(t,'Section',n).match(/^\d+\. /gm)||[]).length,3,file+' section '+n+' alternatives');
}
const catalogPath=path.join(root,'working/content-catalog.json');
if(fs.existsSync(catalogPath)){
 const c=JSON.parse(fs.readFileSync(catalogPath,'utf8'));
 assertCount(c.length,85,'Content ideas');assertCount(new Set(c.map(x=>x.ID)).size,85,'Unique content IDs');
 for(const st of ['TOFU','MOFU','BOFU','AFU','LOFU'])assertCount(c.filter(x=>x.stage===st).length,17,st+' ideas');
 for(const file of ['p2-01-funnel.md','p2-04-funnel-pages.md','p2-05-traffic.md','p2-06-tracking.md']){
   const t=load(file);if(!t)continue;
   const missing=c.filter(x=>!new RegExp('\\b'+x.ID+'\\b').test(t)).map(x=>x.ID);
   if(missing.length)errors.push(file+': missing IDs '+missing.join(','));
 }
}
for(const r of rows){if(r.placeholderCount)warnings.push(`${r.id}: ${r.placeholderCount} explicitly marked evidence or launch placeholders`);}
const result={complete:errors.length===0,outputs:rows.length,totalWords:rows.reduce((s,r)=>s+r.words,0),requiredSections:rows.reduce((s,r)=>s+r.sections,0),errors,warnings,rows};
fs.writeFileSync(path.join(root,'working/content-audit.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({outputs:result.outputs,words:result.totalWords,errors,warnings},null,2));
if(errors.length)process.exitCode=1;
