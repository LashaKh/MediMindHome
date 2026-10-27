import fs from 'node:fs';
import path from 'node:path';
import { marked } from '/Users/toko/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';
import { brandTheme, brandMarkup } from './brand-theme.mjs';

const root = path.resolve(import.meta.dirname, '..');
const deliver = '/Users/toko/Desktop/MediMind - Complete B11 Marketing Library';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'working/manifest.json'), 'utf8'));
const preview = process.argv.includes('--preview');
const esc = x => String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const slug = x => x.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
marked.setOptions({ gfm:true, breaks:false });
fs.mkdirSync(path.join(deliver, 'Individual outputs'), {recursive:true});
fs.mkdirSync(path.join(deliver, 'Editable text'), {recursive:true});
fs.mkdirSync(path.join(deliver, 'Source libraries'), {recursive:true});
fs.mkdirSync(path.join(deliver, 'Source notes'), {recursive:true});

// Curated local evidence snapshots make the reading folder portable without shipping product code.
const evidenceMap = new Map();
const registerEvidence = (source, name, transform = s => s) => {
  const absolute = path.resolve(source);
  if (!fs.existsSync(absolute)) throw new Error(`Missing evidence source: ${absolute}`);
  fs.writeFileSync(path.join(deliver, 'Source notes', name), transform(fs.readFileSync(absolute, 'utf8')));
  evidenceMap.set(absolute, 'Source notes/' + name);
};
const marketingRoot = path.resolve(root, '../..');
for (const file of ['2026-09-22-evidence-register.md','2026-09-22-hospital-buyer-pain-points.md']) {
  registerEvidence(path.join(marketingRoot, 'research', file), file);
}
registerEvidence(path.join(marketingRoot, 'copy/2026-09-22-live-hero-working-draft.md'), 'Current hero snapshot.md');
for (const file of ['00-what-we-are.md','03-scope.md','04-language.md','06-buyers.md']) {
  registerEvidence('/Users/toko/Desktop/medplum_medimind/positioning/' + file, 'Product positioning - ' + file);
}
registerEvidence(path.join(root, 'working/research-addendum.md'), 'Research and source inspection.md', s => s.replace('# Orchestrator research addendum', '# Research and source inspection').replace('Use alongside writer-brief.md.', 'Internal source snapshot; not a live-site test.'));
registerEvidence(path.join(root, 'working/writer-brief.md'), 'Company inputs and editorial assumptions.md', s => '# Company inputs and editorial assumptions\n\nEvidence snapshot: 22 September 2026. These are supplied facts and proposed working decisions, not approved commercial commitments.\n\n' + s.split('## Shared factual baseline and boundaries')[1].split('## Sources to read')[0]);
registerEvidence(path.join(root, 'working/content-catalog.json'), '85-item content catalog.json');
for (const source of ['src/components/Demo/RequestDemo.tsx','src/components/Landing/LampHeroSection.tsx']) {
  evidenceMap.set(path.resolve(marketingRoot, '..', source), 'Source notes/Research and source inspection.md');
}
evidenceMap.set(path.join(root, 'working/main-library.txt'), 'Source libraries/Complete Library - Parts 1 and 2.pdf');
evidenceMap.set(path.join(root, 'working/pages-library.txt'), 'Source libraries/Library 0 - Conversion Pages.pdf');

const available = manifest.filter(m => fs.existsSync(path.join(root,'outputs',m.file)));
if (!preview && available.length !== 20) throw new Error(`Only ${available.length}/20 outputs exist.`);
const chapterData = available.map(m => {
  const raw = fs.readFileSync(path.join(root,'outputs',m.file),'utf8');
  const words = raw.replace(/https?:\/\/\S+/g,'').split(/\s+/).filter(Boolean).length;
  return {...m,raw,words};
});
const totalWords = chapterData.reduce((s,m)=>s+m.words,0);
const baseCss = `
:root{--ink:#172f37;--muted:#576c71;--paper:#fffefa;--line:#d9e3df;--mint:#d9f3e4;--green:#175843;--amber:#b04e24;--navy:#142f38;--orange:#ffba82}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}body{margin:0;background:#f4f5f0;color:var(--ink);font:16px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}a{color:#14644e;text-decoration-thickness:1px;text-underline-offset:3px}a:hover{color:#9b4623}button,input{font:inherit}button,a{touch-action:manipulation}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #d56b30;outline-offset:3px}button{cursor:pointer}.skip{position:fixed;left:12px;top:-90px;z-index:20;padding:12px;background:white}.skip:focus{top:8px}
.sidebar{position:fixed;inset:0 auto 0 0;width:292px;background:var(--navy);color:#e5f2ee;padding:30px 22px;overflow:auto;z-index:5}.brand{font-size:22px;font-weight:750;letter-spacing:-.8px;color:white;text-decoration:none}.brand span{color:var(--orange)}.sidetitle{font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#b6ccc6;margin:7px 0 25px}.navgroup{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:#bdd6ca;margin:25px 0 10px}.navitem{display:flex;align-items:flex-start;gap:11px;color:#e5eeea;text-decoration:none;padding:9px 7px;border-radius:6px;font-size:12px;line-height:1.45}.navitem:hover{background:#24434a;color:white}.navitem b{font:11px/1.9 ui-monospace,monospace;color:var(--orange);min-width:30px}.navmeta{font-size:11px;color:#a9c2ba;margin-top:28px;border-top:1px solid #45605d;padding-top:18px}.sidebar .overviewlink{color:#dbf2e5;font-size:13px}
.layout{margin-left:292px}.toolbar{position:sticky;top:0;z-index:4;display:flex;align-items:center;gap:10px;padding:12px 36px;background:#fffefaee;backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}.toolbar input{flex:1;min-width:100px;background:#eef2ed;border:1px solid #dce5df;border-radius:7px;padding:9px 12px;font-size:13px}.toolbar button,.smallbtn{border:1px solid #bccdc5;background:white;border-radius:6px;padding:9px 13px;font-size:12px;color:var(--ink);white-space:nowrap}.toolbar button:hover,.smallbtn:hover{background:var(--mint)}.searchstatus{font-size:11px;color:var(--muted)}.mobilemenu{display:none}.readingbar{position:fixed;height:3px;background:var(--amber);top:0;left:292px;width:0;z-index:10}
main{max-width:1240px;margin:auto;padding:36px 44px 80px}.cover{padding:58px 54px;background:var(--navy);color:white;border-radius:12px;position:relative;overflow:hidden}.eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#bce4cd}.cover h1{font-family:Georgia,serif;font-size:clamp(40px,4.3vw,68px);line-height:1.06;letter-spacing:-2px;font-weight:400;margin:21px 0 24px;max-width:720px}.cover h1 em{color:var(--orange);font-style:normal}.cover p{max-width:720px;color:#deebe5;font-size:17px;line-height:1.65}.cover .stamp{font:11px/1.5 ui-monospace,monospace;color:#bdd3cb;margin-top:35px}.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #4b686b;margin-top:32px;padding-top:24px;gap:20px}.stat strong{font-family:Georgia,serif;font-size:35px;font-weight:400;color:#ffcca5}.stat span{display:block;font-size:11px;color:#b9cdc5;letter-spacing:.5px}
.intro{padding:30px 5px 14px}.intro p{max-width:85ch}.intro .note{background:#e7eee6;border-left:4px solid var(--green);padding:15px 20px;margin:24px 0}.launch{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:26px 0}.launch>div{border:1px solid var(--line);border-radius:8px;background:#fffefa;padding:20px}.launch h3{margin:0 0 8px;font-size:15px}.launch p{font-size:13px;margin:0;color:var(--muted)}.directory{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.card{display:block;padding:17px 19px;background:var(--paper);border:1px solid var(--line);border-radius:8px;text-decoration:none;color:var(--ink)}.card:hover{border-color:var(--green);background:#eaf4ed}.card small{display:block;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--green);margin-bottom:6px}.card strong{display:block;font-size:15px;line-height:1.4}.card .count{font-size:11px;color:var(--muted);margin-top:7px}.directory-title{font:30px/1.2 Georgia,serif;margin:45px 0 20px}
.chapter{background:var(--paper);border:1px solid var(--line);border-radius:10px;margin:50px 0;padding:40px 42px;scroll-margin-top:88px;min-width:0}.chapter[hidden]{display:none!important}.chapter-label{display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:11px;letter-spacing:1.3px;text-transform:uppercase;color:var(--green);font-weight:700}.chapter-label .number{font:27px Georgia,serif;color:#a54723}.chapter h1{font:40px/1.18 Georgia,serif;letter-spacing:-.7px;margin:20px 0 15px;max-width:24ch}.chapter h2{font:29px/1.25 Georgia,serif;font-weight:400;margin:43px 0 18px;padding-top:27px;border-top:1px solid var(--line);scroll-margin-top:92px}.chapter h3{font-size:19px;line-height:1.4;margin:29px 0 13px}.chapter h4{font-size:15px;margin:24px 0 10px}.chapter p{margin:0 0 17px;max-width:92ch}.chapter ul,.chapter ol{padding-left:23px;margin:10px 0 23px}.chapter li{padding-left:5px;margin:7px 0}.chapter ul li::marker{color:#507961}.chapter strong{font-weight:650}.chapter blockquote{border-left:3px solid #b8d6c4;padding:10px 19px;margin:24px 0;background:#edf4ed;color:#254d3a}.chapter blockquote p:last-child{margin:0}.chapter code{background:#edf0eb;border-radius:3px;padding:2px 4px;font:12px ui-monospace,monospace;overflow-wrap:anywhere}.chapter pre{overflow:auto;background:#e9eeea;padding:18px;border-radius:7px;font-size:12px}.chapter pre code{background:transparent;padding:0;white-space:pre}.chapter a{overflow-wrap:anywhere}.table-wrap{overflow-x:auto;margin:23px 0;border:1px solid var(--line);border-radius:6px}.chapter table{border-collapse:collapse;width:100%;font-size:12.5px;line-height:1.55;min-width:560px}.chapter th{background:#edf2ea;text-align:left;color:#174735;font-size:11px;font-weight:750;position:relative}.chapter th,.chapter td{padding:12px 13px;vertical-align:top;border-bottom:1px solid var(--line);min-width:90px;overflow-wrap:anywhere}.chapter tr:last-child td{border-bottom:0}.chapter tr:nth-child(even) td{background:#fbfcf7}.chapter td:first-child{font-weight:560}.chapter table ul{margin:0;padding-left:15px}.chapter-tools{display:flex;flex-wrap:wrap;gap:9px;align-items:center;padding:10px 0 22px;border-bottom:1px solid var(--line);font-size:11px}.chapter-tools a{font-size:11px}.sourcehint{color:var(--muted);font-size:11px;margin:12px 0}.outline{background:#f3f5ed;border-radius:6px;padding:13px 17px;margin:18px 0 27px;font-size:12px}.outline summary{cursor:pointer;font-weight:650;color:var(--green)}.outline ul{columns:2;padding-left:19px;margin:10px 0 0}.outline li{break-inside:avoid;margin:5px 0}.outline a{text-decoration:none;color:#41634d}.chapter hr{border:0;border-top:1px solid var(--line);margin:28px 0}.bottomnav{display:flex;justify-content:space-between;gap:20px;border-top:1px solid var(--line);margin-top:32px;padding-top:18px;font-size:12px}.empty{padding:50px;text-align:center;background:white;border-radius:10px}.footer{font-size:12px;color:var(--muted);padding:24px 5px}.toast{position:fixed;bottom:22px;right:25px;padding:12px 20px;background:#1a5540;color:white;border-radius:7px;z-index:30;font-size:13px}.statuspill{display:inline-block;padding:3px 8px;background:#e3f0e2;border-radius:20px;font-size:10px;letter-spacing:.3px;color:#315938}
.chapter table.tracking-links{min-width:1050px;table-layout:fixed}.tracking-links th:nth-child(1){width:20%}.tracking-links th:nth-child(2){width:12%}.tracking-links th:nth-child(3){width:50%}.tracking-links th:nth-child(4){width:18%}.table-wrap[data-overflow="true"]::before{content:"Scroll sideways to see all columns →";display:block;position:sticky;left:0;font-size:10px;letter-spacing:.3px;color:var(--green);background:#e7eee3;padding:7px 12px}
.launch-guide ul,.launch-guide ol{columns:1}.launch-guide h2{font:25px/1.3 Georgia,serif;margin:30px 0 15px}.launch-guide table{border-collapse:collapse;width:100%;min-width:520px;font-size:13px}.launch-guide th,.launch-guide td{border-bottom:1px solid var(--line);text-align:left;vertical-align:top;padding:12px}.launch-guide th{background:#dfeadc}.launch-guide .table-wrap{max-width:100%}
@media print{.chapter table.tracking-links{min-width:0;width:100%;font-size:7pt}.table-wrap[data-overflow="true"]::before{display:none}}
@media(min-width:1500px){main{padding-left:65px;padding-right:65px}.chapter{padding:50px 58px}}
@media(max-width:1100px){.sidebar{width:244px;padding:25px 16px}.layout{margin-left:244px}.readingbar{left:244px}main{padding:25px}.chapter{padding:29px}.cover{padding:37px}.toolbar{padding:10px 25px}.outline ul{columns:1}}
@media(max-width:800px){.sidebar{display:none;width:280px;top:60px;z-index:8}.sidebar.open{display:block}.layout{margin-left:0}.readingbar{left:0}.mobilemenu{display:block!important}.toolbar{padding:10px;gap:6px}.toolbar .searchstatus{display:none}main{padding:16px}.cover{padding:31px 25px}.cover h1{font-size:43px;letter-spacing:-1px}.cover p{font-size:15px}.stats{gap:10px}.stat strong{font-size:29px}.directory{grid-template-columns:1fr}.launch{grid-template-columns:1fr}.chapter{padding:25px 20px;margin:28px 0}.chapter h1{font-size:32px}.chapter h2{font-size:25px}.chapter h3{font-size:18px}.chapter table{font-size:12px}.chapter th,.chapter td{padding:10px}.outline ul{columns:1}.toolbar input{font-size:12px;padding:8px}.toolbar button{padding:8px;font-size:11px}.chapter-tools{gap:7px}.smallbtn{padding:7px 9px}.bottomnav{flex-direction:column}.searchstatus{display:none}}
@media print{@page{size:A4;margin:16mm 13mm 19mm}.sidebar,.toolbar,.readingbar,.chapter-tools,.outline,.directory,.directory-title,.launch,.bottomnav,.toast,.skip,.searchstatus{display:none!important}.layout{margin:0}body{background:white;color:#152824;font-size:10pt;line-height:1.5}main{padding:0;max-width:none}.cover{border-radius:0;padding:20mm 12mm;background:#f1f4ec!important;color:#14392f;break-after:page}.cover h1{font-size:42pt}.cover h1 em,.cover p,.cover .eyebrow,.cover .stamp,.stat span{color:#254a3a}.stat strong{color:#945024}.intro{break-after:page}.chapter{border:0;border-radius:0;padding:0;margin:0;break-before:page}.chapter h1{font-size:27pt}.chapter h2{font-size:19pt;padding-top:14px;margin-top:25px;break-after:avoid}.chapter h3,.chapter h4{break-after:avoid}.chapter p{orphans:3;widows:3}.table-wrap{overflow:visible;border:0;margin:12px 0}.chapter table{min-width:0;table-layout:fixed;font-size:7pt}.chapter th,.chapter td{min-width:0;padding:5px;overflow-wrap:anywhere}.chapter tr{break-inside:avoid}.chapter thead{display:table-header-group}.chapter blockquote{break-inside:avoid}.chapter pre{white-space:pre-wrap;overflow-wrap:anywhere}.footer{break-before:avoid}}
`;

const css=brandTheme(baseCss);

function rewriteLinks(content, single=false, sourceDir=path.join(root,'outputs')) {
  return content.replace(/href="([^"]+)"/g,(all,href)=>{
    if(/^(?:https?:|mailto:|#)/i.test(href))return all;
    if(href.startsWith('/')&&!href.startsWith('/Users/'))return `href="https://medimind.md${esc(href)}" title="Campaign destination; see the chapter’s launch prerequisites"`;
    const match=manifest.find(x=>path.basename(decodeURIComponent(href.split('#')[0]))===x.file);
    if(match)return `href="${single?'':'Individual outputs/'}${match.id}.html${href.includes('#')?'#'+href.split('#')[1]:''}"`;
    const decoded=decodeURIComponent(href).replaceAll('&amp;', '&');
    const resolved=decoded.startsWith('file:') ? new URL(decoded).pathname : path.resolve(sourceDir,decoded);
    const bundled=evidenceMap.get(resolved);
    if(bundled)return `href="${single?'../':''}${esc(bundled)}"`;
    return `href="file://${esc(resolved)}"`;
  });
}

function renderChapter(m, index, single=false) {
  const headings=[];
  let content=marked.parse(m.raw.replace(/^# .*\r?\n/,''));
  let n=0;
  content=content.replace(/<h([234])>([\s\S]*?)<\/h\1>/g,(all,level,text)=>{
    const id=`${m.id}-s${++n}`;
    if(level==='2') headings.push({id,text:text.replace(/<[^>]*>/g,'')});
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
  content=content.replace(/<table>([\s\S]*?)<\/table>/g,(_,inner)=>'<div class="table-wrap" role="region" aria-label="Scrollable data table" tabindex="0"><table'+(inner.includes('UTM link structure')?' class="tracking-links"':'')+'>'+inner+'</table></div>');
  // Resolve relative source links against the authoring file. Prompt-to-prompt links become portable outputs.
  content=rewriteLinks(content,single);
  const prefix=single?'../':'';
  const pdf=m.id.startsWith('l0')?'Library 0 - Conversion Pages.pdf':'Complete Library - Parts 1 and 2.pdf';
  const pg=m.pages.split('–')[0];
  const prev=chapterData[index-1],next=chapterData[index+1];
  return `<article class="chapter" id="${m.id}" data-title="${esc(m.title)}">
    <div class="chapter-label"><span class="number">${String(index+1).padStart(2,'0')}</span>${esc(m.label)} <span class="statuspill">Working output</span></div>
    <h1>${esc(m.title)}</h1>
    <div class="chapter-tools"><button class="smallbtn copy" data-id="${m.id}">Copy full answer</button><button class="smallbtn printchapter" data-id="${m.id}">Print this answer</button><a href="${prefix}Editable text/${m.file}" download>Editable text</a>${single?`<a href="../START HERE.html#${m.id}">Back to complete library</a>`:`<a href="Individual outputs/${m.id}.html">Open separately ↗</a>`}</div>
    <p class="sourcehint">Source: <a href="${prefix}Source libraries/${pdf}#page=${pg}">${m.id.startsWith('l0')?'Library #0':'Complete library'}, pages ${m.pages}</a> · ${m.words.toLocaleString()} words · ${m.sections} requested steps / sections</p>
    <details class="outline"><summary>Sections in this answer</summary><ul>${headings.map(h=>`<li><a href="#${h.id}">${h.text}</a></li>`).join('')}</ul></details>
    <div class="answer">${content}</div>
    <div class="bottomnav">${prev?`<a href="${single?prev.id+'.html':'#'+prev.id}">← ${esc(prev.label)}</a>`:'<span>Start of library</span>'}${next?`<a href="${single?next.id+'.html':'#'+next.id}">${esc(next.label)} →</a>`:'<a href="'+(single?'../START HERE.html':'#overview')+'">Back to overview ↑</a>'}</div>
  </article>`;
}

function shell(body, navItems, title, single=false, rawData=chapterData) {
  const nav=navItems.map((m,i)=>`${i===0||navItems[i-1].group!==m.group?`<div class="navgroup">${esc(m.group)}</div>`:''}<a class="navitem" href="${single?m.id+'.html':'#'+m.id}" data-for="${m.id}"><b>${m.id.replace('p1-','1.').replace('p2-','2.').replace('l0-','0.')}</b><span>${esc(m.title)}</span></a>`).join('');
  const scripts=`
const raw=${JSON.stringify(Object.fromEntries(rawData.map(m=>[m.id,m.raw]))).replace(/</g,'\\u003c')};
const allArticles=[...document.querySelectorAll('.chapter')];
const input=document.querySelector('#search');
function flagWideTables(){document.querySelectorAll('.table-wrap').forEach(w=>{w.dataset.overflow=String(w.scrollWidth>w.clientWidth+2);});}
flagWideTables();window.addEventListener('resize',flagWideTables);document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',flagWideTables));
function reset(){input.value='';document.querySelectorAll('[hidden]').forEach(e=>e.hidden=false);document.querySelector('.searchstatus').textContent='';}
input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let count=0;allArticles.forEach(a=>{a.hidden=q&&!a.textContent.toLowerCase().includes(q);if(!a.hidden)count++;});document.querySelectorAll('.navitem').forEach(a=>{const target=document.getElementById(a.dataset.for);a.hidden=target?.hidden||false;});const overview=document.querySelector('#overview');if(overview)overview.hidden=!!q;document.querySelector('#noresults').hidden=count>0;document.querySelector('.searchstatus').textContent=q?count+' answers found':'';});
document.querySelector('#clear').addEventListener('click',reset);
document.querySelector('#print').addEventListener('click',()=>window.print());
document.querySelector('#menu').addEventListener('click',()=>{const s=document.querySelector('.sidebar');s.classList.toggle('open');document.querySelector('#menu').setAttribute('aria-expanded',String(s.classList.contains('open')));});
document.querySelectorAll('.navitem').forEach(a=>a.addEventListener('click',()=>document.querySelector('.sidebar').classList.remove('open')));
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(raw[b.dataset.id]);b.textContent='Copied';setTimeout(()=>b.textContent='Copy full answer',1800);}catch{const ta=document.createElement('textarea');ta.value=raw[b.dataset.id];document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();b.textContent=ok?'Copied':'Select text to copy';}}));
document.querySelectorAll('.printchapter').forEach(b=>b.addEventListener('click',()=>{reset();allArticles.forEach(a=>a.hidden=a.id!==b.dataset.id);const intro=document.querySelector('#overview');if(intro)intro.hidden=true;window.print();}));
window.addEventListener('afterprint',reset);
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();input.focus();}});
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;const offset=innerWidth>1100?292:innerWidth>800?244:0;document.querySelector('.readingbar').style.width=(max>0?scrollY/max*(innerWidth-offset):0)+'px';},{passive:true});
`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="MediMind's complete B11 marketing prompt outputs: research, positioning, funnel, campaign assets, conversion copy, tracking and reporting."><title>${esc(title)}</title><style>${css}</style></head><body><a href="#main" class="skip">Skip to content</a><div class="readingbar"></div><aside class="sidebar"><a class="brand" href="${single?'../START HERE.html':'#overview'}">MediMind<span> /</span></a><div class="sidetitle">The marketing working library</div><a class="overviewlink" href="${single?'../START HERE.html':'#overview'}">Overview & all 20 outputs</a><nav aria-label="Prompt navigation">${nav}</nav><div class="navmeta">B11 · Justyna Jastrzebska<br>Adapted to MediMind<br>22 September 2026<br>Strategy and copy drafts</div></aside><div class="layout"><header class="toolbar"><button id="menu" class="mobilemenu" aria-label="Toggle navigation" aria-expanded="false">Menu</button><input id="search" type="search" placeholder="Search answers…  ⌘K" aria-label="Search complete answers"><span class="searchstatus" aria-live="polite"></span><button id="clear">Show all</button><button id="print">Print</button></header><main id="main">${body}<div id="noresults" class="empty" hidden>No matching answers. Try “pricing”, “interview”, “email” or “tracking”.</div><footer class="footer">Prepared for Lasha and the MediMind team. GPT-6 Sol writing coordinated and reviewed by the parent agent. Source frameworks by Justyna Jastrzebska / 500 Eurasia. Local working documents; execution and validation status is stated in each answer.</footer></main></div><script>${scripts}</script></body></html>`;
}

const index=`<section id="overview"><div class="cover"><div class="eyebrow">MediMind × B11 / Complete working edition</div><h1>From the buyer’s problem<br>to <em>the next customer.</em></h1><p>Every prompt, answered separately. A connected marketing library built around MediMind’s hospital operating system, its buyers, its current evidence and its next stage.</p><div class="stats"><div class="stat"><strong>${available.length}/20</strong><span>SEPARATE PROMPT OUTPUTS</span></div><div class="stat"><strong>${Math.round(totalWords/1000)}k</strong><span>WORDS OF WORKING MATERIAL</span></div><div class="stat"><strong>2</strong><span>SOURCE PROMPT LIBRARIES</span></div></div><div class="stamp">22 SEPTEMBER 2026 · RESEARCH / STRATEGY / COPY / OPERATIONS</div></div><div class="intro"><p>The earlier HTML contained only Part 1, Prompt 1. Its index explicitly left the remaining exercises pending. This edition works through all nine research prompts, all eight funnel/campaign outputs (3A and 3B separately), and the three conversion-page prompts.</p><div class="note"><strong>How to use this.</strong> Start with the overview and read in order, or open any answer separately. Each answer preserves its prompt’s requested steps and counts. Search across the book, copy the full answer, or print a single answer. The editable text and original libraries travel with this folder.</div><div class="launch"><div><h3>What is finished here</h3><p>The written research synthesis, positioning, interview materials, funnel design, campaign scripts and copy, page copy, distribution, measurement specifications and reporting templates. Each is a separate output you can use and revise.</p></div><div><h3>What still needs real-world evidence</h3><p>Local buyer interviews, approved customer quotations and outcomes, exact offer terms, baseline funnel numbers, and scheduling/delivery details for optional webinar and sandbox offers. Those fields are visible where needed.</p></div></div><p><strong>Immediate priority:</strong> verify and repair demo capture before campaign traffic. The inspected source form displays a success state but does not submit the lead to a backend. This is a source finding; deployed behavior and lost-lead volume have not been established.</p><p><strong>Working focus:</strong> Georgia first; private hospital CEOs and operators; a 25-minute pathway demo as the recommended entry point. Marketing plans share one five-hour weekly budget. Kazakhstan and Uzbekistan remain later expansion choices.</p></div><h2 class="directory-title">Your 20 outputs</h2><div class="directory">${chapterData.map((m,i)=>`<a class="card" href="#${m.id}"><small>${String(i+1).padStart(2,'0')} / ${esc(m.label)}</small><strong>${esc(m.title)}</strong><div class="count">${m.sections} requested steps / sections · ${m.words.toLocaleString()} words</div></a>`).join('')}</div></section>`;
const guidePath=path.join(root,'working/launch-guide.md');
const guide=fs.existsSync(guidePath)?fs.readFileSync(guidePath,'utf8'):'';
const guideContent=guide?rewriteLinks(marked.parse(guide.replace(/^# .*\n/,'')),false,path.join(root,'working')).replaceAll('<table>','<div class="table-wrap"><table>').replaceAll('</table>','</table></div>'):'';
const guideHtml=guide?`<details class="outline launch-guide" id="first-week"><summary>Start this week — Lasha's practical five-hour guide</summary><div style="font-size:15px;line-height:1.75;max-width:90ch">${guideContent}</div></details>`:'';
const cleanIndex=index.replace(/<div class="intro">[\s\S]*?(?=<h2 class="directory-title">)/,'');
const completeIndex=cleanIndex.replace('22 SEPTEMBER 2026 · RESEARCH','23 SEPTEMBER 2026 · RESEARCH').replace('<h2 class="directory-title">',guideHtml+'<h2 class="directory-title">');
fs.writeFileSync(path.join(deliver,'START HERE.html'),brandMarkup(shell(completeIndex+chapterData.map((m,i)=>renderChapter(m,i)).join(''),chapterData,'MediMind — B11 Marketing Playbook')));
if(guide)fs.writeFileSync(path.join(deliver,'Editable text','First-week launch guide.md'),guide.replaceAll('../outputs/','').replace('](content-catalog.json)','](<../Source notes/85-item content catalog.json>)'));
for(const [i,m] of chapterData.entries()){
  fs.writeFileSync(path.join(deliver,'Individual outputs',m.id+'.html'),brandMarkup(shell(renderChapter(m,i,true),chapterData,m.title+' — MediMind',true,[m])));
  const editable=m.raw.replace(/\]\((?:<([^>]+)>|([^)]*))\)/g,(all,angle,plain)=>{
    const href=angle||plain;
    if(/^(?:https?:|mailto:|#)/i.test(href))return all;
    if(href.startsWith('/')&&!href.startsWith('/Users/'))return `](https://medimind.md${href})`;
    const matching=manifest.find(x=>path.basename(href)===x.file);
    if(matching)return `](${matching.file})`;
    const resolved=path.resolve(root,'outputs',href);
    const bundled=evidenceMap.get(resolved);
    return bundled?`](<../${bundled}>)`:all;
  });
  fs.writeFileSync(path.join(deliver,'Editable text',m.file),editable);
}
fs.copyFileSync('/Users/toko/Desktop/B11 Marketing Complete Prompt Library Phase 1 Justyna Jastrzebska.pdf',path.join(deliver,'Source libraries','Complete Library - Parts 1 and 2.pdf'));
fs.copyFileSync('/Users/toko/Desktop/B11 Marketing Prompt Library - #0 Justyna Jastrzebska .pdf',path.join(deliver,'Source libraries','Library 0 - Conversion Pages.pdf'));
fs.writeFileSync(path.join(root,'working/build-summary.json'),JSON.stringify({date:'2026-09-23',outputs:chapterData.map(({raw,...m})=>m),totalWords,deliver},null,2));
const auditPath=path.join(root,'working/content-audit.json');
if(fs.existsSync(auditPath)){
  const audit=JSON.parse(fs.readFileSync(auditPath,'utf8'));
  const coverage='# Coverage and handoff\n\nAssembled 23 September 2026 from both supplied B11 libraries. Writing: three GPT-6 Sol agents; coordination, cross-chapter reconciliation and HTML QA: parent agent.\n\n'+
    `Written outputs: ${chapterData.length}/20. Requested top-level sections: ${audit.requiredSections}/138. Approximate word count: ${totalWords.toLocaleString()}. Automated content checks: ${audit.complete?'passed':'in progress'}.\n\n`+
    '| Output | Requested sections | Written answer |\n|---|---:|---|\n'+chapterData.map(m=>`| ${m.label}: ${m.title} | ${m.sections} | [Open](<Individual outputs/${m.id}.html>) |`).join('\n')+
    '\n\n## Scope and limits\n\nAll 85 content IDs appear in the funnel, page map, distribution cards and tracking library. The book includes 36 channel assessments, 11 review records, 15 interview questions, 9 outreach templates, 4 campaign emails, 10 campaign posts, video scripts, 11 page specifications and detailed conversion-page exercises.\n\nThe source PDFs describe 16 sequential prompts; treating 3A and 3B separately yields 17 main-library outputs, plus three from Library #0. Required sections are written; bracketed testimonial, event, policy and baseline fields deliberately remain where real evidence or a business decision is absent. No interviews, customer endorsement, campaign launch, analytics installation, form repair or website deployment occurred.\n\nThe central open launch gate is verified demo-request receipt. The source code uses a simulated submission; deployed behavior and any lost lead count are unverified. The five-hour calendar is shared, and 85 content ideas are a backlog, not a weekly production requirement.\n\nStart with START HERE.html and its expandable first-week guide. Individual outputs are independent HTML files; keep the complete folder together when sharing so source and cross-chapter links remain available. Internal source snapshots preserve some original workspace references; public source URLs remain online references.\n';
  fs.writeFileSync(path.join(deliver,'Coverage and handoff.md'),coverage);
}
console.log(JSON.stringify({outputs:available.length,words:totalWords,path:path.join(deliver,'START HERE.html')}));

// A clearly named Desktop copy prevents the original Prompt 1 tab from being mistaken for the full book.
const desktopCopy='/Users/toko/Desktop/MediMind Marketing - UPDATED - All 20 Prompts.html';
const desktopHtml=fs.readFileSync(path.join(deliver,'START HERE.html'),'utf8')
  .replace('<title>MediMind — B11 Marketing Playbook</title>','<title>MediMind — Marketing Playbook — All 20 Prompts</title>')
  .replace(/href="([^\"]+)"/g,(all,href)=>/^(?:#|[a-z][a-z0-9+.-]*:|\/)/i.test(href)?all:`href="MediMind - Complete B11 Marketing Library/${href}"`);
fs.writeFileSync(desktopCopy,desktopHtml);
console.log(JSON.stringify({desktopCopy,chapters:(desktopHtml.match(/<article class="chapter"/g)||[]).length,bytes:Buffer.byteLength(desktopHtml)}));
