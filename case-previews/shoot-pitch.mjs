import { chromium } from 'playwright';
const FILE = 'file:///Users/toko/Desktop/MediMind%20Landing%20Page/public/pitch.html';
const DIR = '/Users/toko/Desktop/MediMind Landing Page/case-previews';
const b = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());

async function shoot(w, h, name) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.goto(FILE, { waitUntil: 'load' });
  await p.waitForFunction(() => window.Reveal && typeof window.Reveal.slide === 'function', { timeout: 15000 }).catch(() => {});
  await p.evaluate(() => {
    const s = [...document.querySelectorAll('.reveal .slides > section')];
    const i = s.findIndex(x => x.classList.contains('csx-slide'));
    if (i >= 0) window.Reveal.slide(i, 0);
  });
  await p.waitForTimeout(1700);
  await p.screenshot({ path: `${DIR}/pitch-${name}.png` });
  await p.close();
  console.log('shot', name);
}

await shoot(1280, 720, 'desktop');
await shoot(390, 844, 'm390');
await shoot(390, 1400, 'm390tall');
await shoot(320, 1200, 'm320');
await b.close();
console.log('done');
