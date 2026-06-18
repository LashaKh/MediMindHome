import { chromium } from 'playwright';
const BASE = 'http://localhost:8137/pitch.html';
const DIR = '/Users/toko/Desktop/MediMind Landing Page/case-previews';
const target = process.argv[2] || 'cover';
const b = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());

async function shoot(w, h, name) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.Reveal && typeof window.Reveal.slide === 'function', { timeout: 15000 }).catch(() => {});
  await p.evaluate((cls) => {
    const s = [...document.querySelectorAll('.reveal .slides > section')];
    const i = s.findIndex(x => x.classList.contains(cls));
    if (i >= 0) window.Reveal.slide(i, 0);
  }, target);
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${DIR}/${target}-${name}.png` });
  await p.close();
  console.log('shot', target, name);
}

await shoot(1280, 720, 'desktop');
await shoot(390, 844, 'm390');
await b.close();
console.log('done');
