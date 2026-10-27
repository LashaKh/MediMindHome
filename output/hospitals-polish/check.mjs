import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const [stage='before',lang='ka',w='1280',h='720']=process.argv.slice(2);
const out=fileURLToPath(new URL(`./${stage}-${lang}-${w}/`,import.meta.url));
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:+w,height:+h},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://localhost:5173/hospitals.html',{waitUntil:'domcontentloaded'});
 await page.locator('#hc-pass').fill('medimind');
 await page.locator('#hc-form button').click();
 await page.waitForFunction(()=>window.Reveal?.isReady());
 await page.evaluate(language=>{window.mmSetLang(language);Reveal.configure({transition:'none',backgroundTransition:'none'});},lang);
 await page.addStyleTag({content:'.reveal *,.reveal *::before,.reveal *::after{animation:none!important;transition:none!important}.mobile-nav,.controls,.progress{opacity:0!important}'});
 await page.evaluate(()=>document.fonts.ready);
 const total=await page.evaluate(()=>Reveal.getTotalSlides());
 const slides=[];
 for(let i=0;i<total;i++){
  await page.evaluate(index=>Reveal.slide(index),i);
  const active=page.locator('.slides>section.present');
  await active.evaluate(section=>{section.scrollTop=0;});
  await active.screenshot({path:`${out}${String(i+1).padStart(2,'0')}.png`});
  if(+w<=768){
   const travel=await active.evaluate(section=>section.scrollHeight-section.clientHeight);
   for(let top=Math.min(+h-120,travel),part=1;travel>0;top=Math.min(top+(+h-120),travel),part++){
    await active.evaluate((section,position)=>{section.scrollTop=position;},top);
    await active.screenshot({path:`${out}${String(i+1).padStart(2,'0')}-scroll-${part}.png`});
    if(top>=travel)break;
   }
   await active.evaluate(section=>{section.scrollTop=0;});
  }
  slides.push(await active.evaluate((section,index)=>{
   const frame=section.getBoundingClientRect();
   const visible=element=>{const b=element.getBoundingClientRect();return b.width>0&&b.height>0&&!element.closest('aside.notes,svg,.tour-iframe');};
   const candidates=[...section.querySelectorAll('h1,h2,h3,p,[class^="hx"]')].filter(visible);
   const overflow=candidates.filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>e.className);
   const clipped=candidates.filter(e=>{const b=e.getBoundingClientRect();return b.right>frame.right+2||b.left<frame.left-2||(innerWidth>768&&b.bottom>frame.bottom+2);}).map(e=>e.className||e.tagName);
   return{slide:index+1,classes:section.className,text:section.innerText,overflow:[...new Set(overflow)],clipped:[...new Set(clipped)],scrollHeight:section.scrollHeight,clientHeight:section.clientHeight};
  },i));
 }
 await writeFile(`${out}report.json`,JSON.stringify({lang,width:+w,height:+h,total,errors,slides},null,2));
 console.log(JSON.stringify({stage,lang,width:w,total,errors,problems:slides.filter(s=>s.overflow.length||s.clipped.length).map(({text,...s})=>s),out}));
} finally {await browser.close();}
