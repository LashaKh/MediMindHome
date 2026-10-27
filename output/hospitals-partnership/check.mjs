import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const out = fileURLToPath(new URL('./', import.meta.url));
const variants = [['ka',1280,720],['en',1280,720],['ka',390,844],['en',390,844],['ka',320,568],['ka',768,1024]];
const mode = process.argv[2];
const selected = mode === 'desktop' ? variants.slice(0,2) : mode === 'mobile' ? variants.slice(2) : variants;
const browser = await chromium.launch({ channel: 'chrome' });
const reports = [];
try {
  for (const [lang,width,height] of selected) {
    const page = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://localhost:5173/hospitals.html?lang=${lang}#/hospital-partnership`,{waitUntil:'domcontentloaded'});
    await page.locator('#hc-pass').fill('medimind');
    await page.locator('#hc-form button').click();
    await page.waitForFunction(()=>window.Reveal?.isReady() && Reveal.getCurrentSlide()?.id==='hospital-partnership');
    await page.evaluate(()=>{Reveal.configure({transition:'none',backgroundTransition:'none'});});
    await page.evaluate(()=>document.fonts.ready);
    const active=page.locator('#hospital-partnership');
    const geometry=await active.evaluate(section=>{
      const frame=section.getBoundingClientRect();
      const candidates=[...section.querySelectorAll('[class^="hpo"],h2,h3,p,li')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&!el.closest('aside.notes');});
      const clipped=candidates.filter(el=>{const r=el.getBoundingClientRect();return r.left<frame.left-2||r.right>frame.right+2||(innerWidth>768&&r.bottom>frame.bottom+2);}).map(el=>el.className||el.tagName);
      const overflow=candidates.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.className||el.tagName);
      const blocks=[...section.querySelector('.slide-inner').children].filter(el=>!el.classList.contains('slide-label'));
      const overlaps=blocks.slice(1).flatMap((el,i)=>blocks[i].getBoundingClientRect().bottom>el.getBoundingClientRect().top+1?[el.className]:[]);
      const assurances=[...section.querySelectorAll('.hpo-assurance')].map(card=>({bottom:card.getBoundingClientRect().bottom,textBottom:card.querySelector('p').getBoundingClientRect().bottom}));
      return {clipped,overflow,overlaps,assurances,scrollHeight:section.scrollHeight,clientHeight:section.clientHeight,text:section.innerText,total:Reveal.getTotalSlides(),language:document.documentElement.lang,sequence:[...document.querySelectorAll('.slides>section')].slice(0,5).map(el=>el.id||el.className)};
    });
    await page.screenshot({path:`${out}${lang}-${width}.png`});
    if(width<=768){
      const travel=geometry.scrollHeight-geometry.clientHeight;
      for(let top=Math.min(height-100,travel),n=1;travel>0;top=Math.min(top+height-100,travel),n++){
        await active.evaluate((el,y)=>{el.scrollTop=y;},top);
        await page.screenshot({path:`${out}${lang}-${width}-scroll-${n}.png`});
        if(top>=travel)break;
      }
      await active.evaluate(el=>{el.scrollTop=0;});
    }
    assert.equal(geometry.language,lang);
    assert.equal(geometry.total,18);
    assert.match(geometry.sequence[0],/cover/);
    assert.equal(geometry.sequence[1],'hospital-reality');
    assert.match(geometry.sequence[2],/hxr3-slide/);
    assert.equal(geometry.sequence[3],'hospital-partnership');
    assert.match(geometry.sequence[4],/hxs-slide/);
    if(width===1280 && lang==='ka'){
      await page.keyboard.press('ArrowLeft');
      await page.waitForFunction(()=>Reveal.getCurrentSlide().classList.contains('hxr3-slide'));
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(()=>Reveal.getCurrentSlide().id==='hospital-partnership');
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(()=>Reveal.getCurrentSlide().classList.contains('hxs-slide'));
      await page.evaluate(()=>Reveal.slide(0));
      await page.getByRole('button',{name:'ENG',exact:true}).click();
      await page.evaluate(()=>Reveal.slide(3));
      assert.equal(await page.locator('.hpo-headline .lang-en').isVisible(),true);
      assert.equal(await page.locator('.hpo-headline .lang-ka').isVisible(),false);
    }
    reports.push({lang,width,height,errors,...geometry});
    console.log(JSON.stringify({lang,width,errors,clipped:geometry.clipped,overflow:geometry.overflow,overlaps:geometry.overlaps}));
    await page.close();
  }
  await writeFile(`${out}report${mode?`-${mode}`:''}.json`,JSON.stringify(reports,null,2));
} finally { await browser.close(); }
