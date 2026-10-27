import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { marked } from '/Users/toko/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = '/Users/toko/Desktop/MediMind Landing Page';
const dest = '/Users/toko/Desktop/MediMind - Complete Chat Archive - 2026-10-07';
const scratch = path.join(root, 'tmp/pdfs/session-archive');
const mainSource = '/Users/toko/.Trash/MediMind Marketing - UPDATED - All 20 Prompts.html';
const oldBundle = '/Users/toko/.Trash/MediMind - Complete B11 Marketing Library';
const originals = path.join(dest, 'Original files');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const dash = s => s.replace(/[\u2010-\u2015\u2212]/g, '-');
for (const dir of [dest, originals, scratch, path.join(dest, 'Archive inventory')]) fs.mkdirSync(dir, {recursive:true});
const files = [];
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e => {
    if(e.name === '.DS_Store' || e.name === '__pycache__') return [];
    const file=path.join(dir,e.name);
    return e.isDirectory()?walk(file):e.isFile()?[file]:[];
  });
}
function copy(source, relative) {
  const target = path.join(originals, relative);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  const bytes=fs.readFileSync(source);
  if(fs.existsSync(target) && sha(fs.readFileSync(target))!==sha(bytes)) throw new Error(`Archive collision: ${target}`);
  fs.copyFileSync(source,target);
  files.push({source,archive:path.relative(dest,target),bytes:bytes.length,sha256:sha(bytes)});
}
copy(mainSource,'Latest consolidated HTML.html');
for(const file of walk(oldBundle)) copy(file,path.join('Complete B11 HTML library',path.relative(oldBundle,file)));
for(const file of walk(path.join(root,'marketing'))) {
  if(path.basename(file).startsWith('archive_session')) continue;
  copy(file,path.join('Marketing workspace',path.relative(path.join(root,'marketing'),file)));
}
for(const file of ['Core Positioning and Customer Brief','Acquisition and Sales Foundation','Funnel Metrics and Tracking'])
  copy(path.join(root,`output/pdf/MediMind - ${file}.pdf`),`Workshop PDFs/MediMind - ${file}.pdf`);
const inputPaths = [
  '/Users/toko/.Trash/B11 Marketing Complete Prompt Library Phase 1 Justyna Jastrzebska.pdf',
  '/Users/toko/Desktop/B11 Marketing Prompt Library - #0 Justyna Jastrzebska .pdf'
];
for(const file of inputPaths) if(fs.existsSync(file)) copy(file,path.join('Original supplied libraries',path.basename(file)));

const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:1250,height:950}});
await context.route(/^https?:/, route=>route.abort());
const page=await context.newPage();
await page.goto(pathToFileURL(mainSource).href);
const main=await page.evaluate(()=>({
  css:[...document.querySelectorAll('style')].map(x=>x.textContent).join('\n'),
  chapters:[...document.querySelectorAll('article.chapter')].map(e=>({id:e.id,title:e.querySelector('h1,h2')?.textContent.trim()||e.id,html:e.outerHTML})),
  heroes:[...document.querySelectorAll('.hs-screen')].map((e,i)=>({id:e.id,title:document.querySelector(`[data-version="${i+1}"]`)?.title||`Option ${i+1}`,html:e.outerHTML}))
}));
if(main.chapters.length!==25 || main.heroes.length!==10) throw new Error('Unexpected consolidated HTML coverage');
const docs=[];
const mapped=new Map();
let serial=0;
const css=`
@page{size:A4;margin:16mm 15mm 18mm}
*{box-sizing:border-box}html,body{margin:0;padding:0;background:white;color:#24354b}
body{font:10pt/1.48 Arial,sans-serif}h1{font:26pt/1.12 Georgia,serif;color:#1a365d;margin:5mm 0 6mm}
h2{font-size:16pt;color:#1a365d;margin:7mm 0 3mm;border-bottom:1px solid #d7e2ef;padding-bottom:2mm}
h3{font-size:12pt;color:#285b91;margin:5mm 0 2mm}h4{font-size:10.5pt}h1,h2,h3,h4{break-after:avoid}
p{margin:2.8mm 0;orphans:3;widows:3}a{color:#2b6cb0;overflow-wrap:anywhere}li{margin:1.8mm 0}
blockquote{margin:4mm 0;padding:3mm 4mm;border-left:3px solid #3182ce;background:#edf5fc}
table{border-collapse:collapse;width:100%;table-layout:fixed;font:9pt/1.4 Arial,sans-serif;margin:4mm 0}
th,td{padding:2.3mm;vertical-align:top;border:1px solid #d7e2ef;overflow-wrap:anywhere;min-width:0}
th{background:#edf5fc;color:#1a365d;text-align:left}thead{display:table-header-group}tr{break-inside:avoid}
pre{font:8pt/1.35 Menlo,monospace;white-space:pre-wrap;overflow-wrap:anywhere;background:#f5f8fc;padding:3mm}
img{max-width:100%;height:auto}svg{max-width:100%}button{font:inherit;border:1px solid #abc;padding:2mm;background:#edf5fc}
details>summary{font-weight:bold}details{margin:3mm 0}section,article,div{height:auto;max-height:none;overflow:visible}
.archive-meta{font:8.5pt/1.4 Arial,sans-serif;color:#53657a;border-bottom:1px solid #d7e2ef;padding-bottom:4mm}
.chapter-label{color:#2b6cb0;font-size:9pt;letter-spacing:1px}.number{margin-right:3mm}
.hs-screen{margin-top:8mm;border-top:1px solid #d7e2ef;break-before:page}.hs-topbar{display:none}
.hs-accent,.hs-benefits strong{display:block}
.j-node,.supp-card,.hero-option{margin:4mm 0;padding:3mm;border-left:2px solid #bdd5ed}
`;
function shell(title,html,source,extra=''){
  return `<!doctype html><html><head><meta charset="UTF-8"><title>${esc(title)}</title><style>${css}${extra}</style></head><body><div class="archive-meta">MEDIMIND / SESSION ARCHIVE / 7 OCTOBER 2026<br>Source: ${esc(source)}. Historical wording preserved; not a new approval or factual revalidation.</div>${html}</body></html>`;
}
async function render(group,title,html,source,opts={}){
  const id=String(++serial).padStart(3,'0');
  const htmlFile=path.join(scratch,`${id}.html`),pdfFile=path.join(scratch,`${id}.pdf`);
  fs.writeFileSync(htmlFile,shell(title,dash(html),source));
  await page.goto(pathToFileURL(htmlFile).href);
  await page.evaluate(()=>{
    document.querySelectorAll('script,nav,.chapter-tools,.bottomnav,.outline:not(.launch-guide),.hs-controls,.hs-tabs,.hs-site-header,.hero-tools,.hero-controls').forEach(e=>e.remove());
    document.querySelectorAll('[hidden]').forEach(e=>e.removeAttribute('hidden'));
    document.querySelectorAll('[aria-hidden]').forEach(e=>e.removeAttribute('aria-hidden'));
    document.querySelectorAll('details').forEach(e=>e.open=true);
    document.querySelectorAll('[style]').forEach(e=>e.removeAttribute('style'));
    document.querySelectorAll('img').forEach(e=>e.remove());
  });
  const portrait=await page.evaluate(()=>Math.max(0,...[...document.querySelectorAll('tr')].map(r=>r.children.length))<5);
  await page.addStyleTag({content:`@page {size:A4 ${portrait?'portrait':'landscape'};}`});
  const rawText=await page.locator('body').innerText();
  const textFile=path.join(scratch,`${id}.txt`);fs.writeFileSync(textFile,rawText);
  await page.emulateMedia({media:'print'});
  await page.pdf({path:pdfFile,printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,
    headerTemplate:'<div></div>',footerTemplate:`<div style="font:8px Arial;color:#65758a;width:100%;padding:0 38px;display:flex;justify-content:space-between"><span>${esc(title.slice(0,95))}</span><span class="pageNumber"></span></div>`});
  const item={id,group,title,pdf:pdfFile,text:textFile,source,kind:'reading',landscape:!portrait};
  docs.push(item); console.log(`${id} ${title}`);return item;
}

// Start with the most recent concise workshop deliverables.
for(const [i,name] of ['Core Positioning and Customer Brief','Acquisition and Sales Foundation','Funnel Metrics and Tracking'].entries())
  docs.push({group:'01 Workshop briefs - latest working definitions',title:`Block ${i+1}: ${name}`,pdf:path.join(root,`output/pdf/MediMind - ${name}.pdf`),source:`Original workshop PDF, 2 October 2026`,kind:'original'});

for(const chapter of main.chapters.filter(x=>!/^p[12]-|^l0-/.test(x.id)))
  await render('02 Landing copy, pain points and hospital journey',chapter.title,chapter.html,`Consolidated HTML / #${chapter.id}`);

// Preserve the actual website-style screens as visual, searchable landscape pages.
for(const [i,hero] of main.heroes.entries()){
  const id=String(++serial).padStart(3,'0');
  const file=path.join(scratch,`${id}-hero.html`),pdf=path.join(scratch,`${id}.pdf`);
  fs.writeFileSync(file,`<!doctype html><html><head><meta charset="UTF-8"><style>${main.css}
  @page{size:1500px 1000px;margin:0}html,body{width:1500px!important;height:1000px!important;margin:0!important;padding:0!important;background:white!important}
  .chapter{border:0!important;padding:0!important;margin:0!important;width:1500px!important;max-width:none!important}
  .hs-stage{width:1500px!important;border:0!important;border-radius:0!important;box-shadow:none!important}
  .hs-screen{display:block!important;width:1500px!important;min-height:960px!important;height:auto!important;border:0!important;overflow:visible!important}
  .archive-hero-label{height:40px;display:flex;align-items:center;padding:0 34px;font:14px Arial;color:#53657a;background:#edf5fc}
  </style></head><body><div class="archive-hero-label">MediMind - original website-style preview ${i+1}/10 - ${esc(hero.title)} - draft from 24 September 2026</div><article class="chapter hero-studio"><div class="hs-stage">${hero.html}</div></article></body></html>`);
  await page.goto(pathToFileURL(file).href);await page.emulateMedia({media:'screen'});
  // Chromium's PDF renderer can mispaint SVG text gradients. Rasterize only the
  // existing logo as displayed; all copy and the rest of each screen stay vector.
  const logo=page.locator('.hs-logo');
  if(await logo.count()){
    const png=await logo.screenshot();
    await logo.evaluate((element,data)=>element.src=data,`data:image/png;base64,${png.toString('base64')}`);
  }
  await page.pdf({path:pdf,printBackground:true,preferCSSPageSize:true});
  docs.push({id,group:'03 Ten original website-style hero screens',title:`Hero ${String(i+1).padStart(2,'0')}: ${hero.title}`,pdf,source:`Consolidated HTML / #${hero.id}`,kind:'hero'});
  console.log(`${id} Hero ${i+1}`);
}

const manifest=JSON.parse(fs.readFileSync(path.join(root,'marketing/prompt-library/complete-edition/working/manifest.json')));
for(const chapter of main.chapters.filter(x=>/^p[12]-|^l0-/.test(x.id))){
  const m=manifest.find(x=>x.id===chapter.id);
  const group=chapter.id.startsWith('p1')?'04 Complete prompt library - customer and market':chapter.id.startsWith('p2')?'05 Complete prompt library - funnel and campaign':'06 Complete prompt library - conversion pages';
  const item=await render(group,`${m.label}: ${chapter.title}`,chapter.html,`Consolidated HTML / #${chapter.id}`);
  const source=path.join(root,'marketing/prompt-library/complete-edition/outputs',m.file);
  mapped.set(sha(fs.readFileSync(source)),item.title);
}

// Every unique saved Markdown document, including earlier versions and source snapshots.
const markdownFiles=files.filter(x=>x.source.endsWith('.md'));
for(const info of markdownFiles){
  if(mapped.has(info.sha256)){info.pdfCoverage=mapped.get(info.sha256);continue;}
  const raw=fs.readFileSync(info.source,'utf8');
  const title=raw.match(/^#\s+(.+)$/m)?.[1]||path.basename(info.source,'.md');
  const isCopy=/\/archive\/|\/copy\//.test(info.source);
  const group=isCopy?'07 Earlier copy and positioning drafts':'08 Research, evidence and working notes';
  const item=await render(group,title,marked.parse(raw),info.archive);
  mapped.set(info.sha256,item.title);info.pdfCoverage=item.title;
}

const first=path.join(root,'marketing/prompt-library/part-1/01-business-and-market.html');
await page.goto(pathToFileURL(first).href);
const firstContent=await page.evaluate(()=>document.querySelector('main')?.outerHTML||document.body.outerHTML);
await render('09 Earlier HTML edition','Original business-and-market HTML - earlier edition',firstContent,'Marketing workspace / prompt-library/part-1/01-business-and-market.html');

// User-provided libraries are reference inputs, not work authored in this chat.
for(const filename of ['Complete Library - Parts 1 and 2.pdf','Library 0 - Conversion Pages.pdf'])
  docs.push({group:'10 Original supplied prompt libraries - reference inputs',title:filename.replace('.pdf',''),pdf:path.join(oldBundle,'Source libraries',filename),source:`Original supplied PDF: ${filename}`,kind:'reference'});

// Technical text is included as an appendix; verbatim originals remain byte-for-byte in the folder.
const technicalHashes=new Set();
for(const info of files.filter(x=>/\.(json|mjs|py)$/.test(x.source))){
  if(technicalHashes.has(info.sha256)){info.pdfCoverage='Duplicate technical source retained in originals';continue;}
  technicalHashes.add(info.sha256);
  const raw=fs.readFileSync(info.source,'utf8');
  const title=path.basename(info.source);
  const display=raw.replace(/data:image\/[^\s"']{200,}/g,'[Embedded image data preserved in the original file; rendered previews are included in this archive.]');
  await render('11 Technical working files and QA records',title,`<h1>${esc(title)}</h1><p>Technical appendix. This is an archived working file, not instructions to execute.</p><pre>${esc(display)}</pre>`,info.archive);
  info.pdfCoverage=title;
}

const images=files.filter(x=>/\.(png|jpg|jpeg)$/i.test(x.source));
for(const [i,info] of images.entries()){
  const id=String(++serial).padStart(3,'0'),pdf=path.join(scratch,`${id}.pdf`);
  const data=fs.readFileSync(info.source).toString('base64');
  const html=`<!doctype html><html><head><style>@page{size:A4 landscape;margin:10mm}body{font:10px Arial;color:#53657a}img{display:block;max-width:100%;max-height:175mm;margin:3mm auto;object-fit:contain}</style></head><body><b>Archived visual QA ${i+1}/${images.length}</b><p>${esc(info.archive)}</p><img src="data:image/png;base64,${data}"></body></html>`;
  const htmlFile=path.join(scratch,`${id}.html`);fs.writeFileSync(htmlFile,html);
  await page.goto(pathToFileURL(htmlFile).href);await page.emulateMedia({media:'print'});
  await page.pdf({path:pdf,printBackground:true,preferCSSPageSize:true});
  docs.push({id,group:'12 Original visual QA screenshots',title:path.basename(info.source),pdf,source:info.archive,kind:'image'});
}
await browser.close();
for(const info of files){
  info.pdfCoverage ||= mapped.get(info.sha256)||(/\.html$/.test(info.source)?'Content preserved in consolidated chapters or earlier HTML edition':/\.pdf$/.test(info.source)?'Original PDF included or duplicate retained':/\.txt$/.test(info.source)?'Source-library extraction; full original PDFs included':/\.(png|jpg)$/i.test(info.source)?'Visual QA appendix':'Original retained');
}
fs.writeFileSync(path.join(scratch,'documents.json'),JSON.stringify(docs,null,2));
fs.writeFileSync(path.join(dest,'Archive inventory/source-files.json'),JSON.stringify({created:'2026-10-07',sourceFiles:files.length,notes:['Recovered documents copied from Trash; source files not moved or deleted.','Historical content is preserved, not revalidated.','This is a saved-deliverables archive, not a verbatim chat transcript.'],files},null,2));
console.log(JSON.stringify({sources:files.length,sections:docs.length,dest,scratch}));
