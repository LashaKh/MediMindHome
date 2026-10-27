import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const [lang = 'ka', widthText = '1280', heightText = '720'] = process.argv.slice(2);
const width = Number(widthText), height = Number(heightText);
const out = `output/hospitals-justina/${lang}-${width}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
try {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://localhost:5173/hospitals.html?lang=${lang}`);
  await page.locator('#hc-pass').fill('medimind');
  await page.locator('#hc-form button').click();
  await page.waitForFunction(() => window.Reveal?.isReady());
  if (await page.locator('html').getAttribute('lang') !== lang) throw new Error('Shared language link was not respected');
  await page.evaluate(() => Reveal.configure({ transition: 'none', backgroundTransition: 'none' }));
  await page.addStyleTag({content:'.reveal *,.reveal *::before,.reveal *::after{animation:none!important;transition:none!important}'});
  await page.evaluate(() => document.fonts.ready);
  const total = await page.evaluate(() => Reveal.getTotalSlides());
  for (let i = 0; i < total; i++) {
    await page.evaluate(index => Reveal.slide(index), i);
    const active = page.locator('.slides>section.present');
    await active.evaluate(e => { e.scrollTop = 0; });
    const id = await active.getAttribute('id');
    await active.screenshot({ path: `${out}/${String(i).padStart(2, '0')}-${id}.png` });
    const geometry = await active.evaluate(section => {
      const rect = e => e.getBoundingClientRect();
      const frame = rect(section);
      const visible = e => {
        const r = rect(e);
        return r.width > 0 && r.height > 0 && !e.closest('aside,svg,iframe');
      };
      const candidates = [...section.querySelectorAll('h1,h2,h3,p,li,th,td,.hjb-card,.hjb-bottom,.hxr3-cell-t,.hxp-left,.hxp-right,.hxv-card')].filter(visible);
      const outside = candidates.filter(e => {
        const r = rect(e);
        return r.left < frame.left - 2 || r.right > frame.right + 2 || (innerWidth > 768 && r.bottom > frame.bottom + 2);
      }).map(e => e.className || e.tagName);
      const overlaps = [];
      for (const cell of section.querySelectorAll('.hxr3-cell')) {
        const text = cell.querySelector('.hxr3-cell-t');
        if (rect(text).top < rect(cell).top - 2 || rect(text).bottom > rect(cell).bottom + 2) overlaps.push('comparison-row');
      }
      const cards = [...section.querySelectorAll('.hjb-card')];
      const bottom = section.querySelector('.hjb-bottom');
      if (cards.length && bottom && rect(bottom).top < Math.max(...cards.map(e => rect(e).bottom)) + 6) overlaps.push('cards-bottom-note');
      const offer = section.querySelector('.bm-arr');
      if (offer) {
        const columns = [...section.querySelectorAll('.hxo2-col')];
        if (rect(offer).top < Math.max(...columns.map(e => rect(e).bottom)) + 6) overlaps.push('offer-panel');
      }
      return { outside: [...new Set(outside)], overlaps: [...new Set(overlaps)], text: section.innerText, scrollHeight: section.scrollHeight };
    });
    if (width <= 768) {
      const travel = await active.evaluate(e => e.scrollHeight - e.clientHeight);
      for (let top = Math.min(height - 120, travel), part = 1; travel > 0; top = Math.min(top + height - 120, travel), part++) {
        await active.evaluate((e, y) => { e.scrollTop = y; }, top);
        await active.screenshot({ path: `${out}/${String(i).padStart(2, '0')}-${id}-scroll-${part}.png` });
        if (top >= travel) break;
      }
    }
    results.push({ i, id, ...geometry });
  }
  const report = { lang, width, height, total, errors, results };
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({lang, width, total, errors, problems: results.filter(s => s.outside.length || s.overlaps.length).map(({text,...s}) => s)}));
} finally {
  await browser.close();
}
