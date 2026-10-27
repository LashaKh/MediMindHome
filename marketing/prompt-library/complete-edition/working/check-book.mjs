import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '/Users/toko/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const root=path.resolve(import.meta.dirname,'..');
const delivery='/Users/toko/Desktop/MediMind - Complete B11 Marketing Library';
const qa=path.join(root,'working/qa');
fs.mkdirSync(qa,{recursive:true});
const summary=JSON.parse(fs.readFileSync(path.join(root,'working/build-summary.json'),'utf8'));
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.goto('file://'+path.join(delivery,'START HERE.html'));
await page.screenshot({path:path.join(qa,'desktop-overview.png')});
const structural=await page.evaluate(()=>({
  chapters:document.querySelectorAll('article.chapter').length,
  h2:document.querySelectorAll('article.chapter h2').length,
  tables:document.querySelectorAll('article.chapter table').length,
  overflow:document.documentElement.scrollWidth>innerWidth,
  duplicateIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((x,i,a)=>a.indexOf(x)!==i),
  brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1))),
  fileLinks:[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>h.startsWith('file:')),
  emptyCells:[...document.querySelectorAll('.answer td')].filter(e=>!e.textContent.trim()).length
}));
if(structural.chapters!==summary.outputs.length)errors.push('Wrong chapter count');
if(structural.overflow)errors.push('Desktop overflow');
if(structural.duplicateIds.length)errors.push('Duplicate IDs');
if(structural.brokenAnchors.length)errors.push('Broken anchors');
const missingFiles=[...new Set(structural.fileLinks)].filter(h=>!fs.existsSync(decodeURIComponent(new URL(h).pathname)));
// Assets linked by the authors to planned website routes are HTTP links, not local files.
for(const m of summary.outputs){
  await page.locator('#'+m.id).scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(qa,m.id+'-desktop.png')});
}
await page.locator('#search').fill('PLACEHOLDER');
const searchCount=await page.locator('.chapter:visible').count();
if(searchCount===0)errors.push('Search did not find proof placeholders');
await page.locator('#clear').click();
if(await page.locator('.chapter:visible').count()!==summary.outputs.length)errors.push('Show all failed');
await page.evaluate(()=>{window.print=()=>{window.__printRequested=true;};});
await page.locator('.printchapter').first().click();
if(await page.locator('.chapter:visible').count()!==1)errors.push('Print-one did not isolate one answer');
await page.evaluate(()=>dispatchEvent(new Event('afterprint')));
if(await page.locator('.chapter:visible').count()!==summary.outputs.length)errors.push('After-print did not restore all answers');
await page.setViewportSize({width:390,height:844});
await page.evaluate(()=>scrollTo(0,0));
await page.screenshot({path:path.join(qa,'mobile-overview.png')});
await page.locator('#menu').click();
if(!(await page.locator('.sidebar').isVisible()))errors.push('Mobile menu failed');
await page.locator('#menu').click();
await page.locator('#first-week summary').click();
const guideOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
if(guideOverflow)errors.push('Expanded first-week guide overflows mobile');
await page.locator('#first-week').scrollIntoViewIfNeeded();
await page.screenshot({path:path.join(qa,'mobile-first-week-guide.png')});
await page.locator('#first-week summary').click();
for(const id of ['p1-03','p1-06','p2-01','p2-03b','p2-06','l0-01']){
  if(!summary.outputs.some(m=>m.id===id))continue;
  await page.locator('#'+id).scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(qa,id+'-mobile.png')});
}
const mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
if(mobileOverflow)errors.push('Mobile page overflow');
for(const m of summary.outputs){
  await page.goto('file://'+path.join(delivery,'Individual outputs',m.id+'.html'));
  if(await page.locator('.chapter').count()!==1)errors.push('Separate output has wrong chapter count: '+m.id);
}
await browser.close();
const result={outputs:summary.outputs.length,words:summary.totalWords,headings:structural.h2,tables:structural.tables,searchCount,missingFiles,errors,qa};
fs.writeFileSync(path.join(qa,'check.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(errors.length||missingFiles.length)process.exitCode=1;
