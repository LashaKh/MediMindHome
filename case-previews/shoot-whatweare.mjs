import { chromium } from 'playwright';
const DIR = '/Users/toko/Desktop/MediMind Landing Page/case-previews';
const b = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 1340, height: 800 }, deviceScaleFactor: 2 });
for (const f of ['whatweare-a', 'whatweare-b', 'whatweare-c']) {
  await p.goto('file://' + DIR + '/' + f + '.html', { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.waitForTimeout(1200);
  const el = await p.$('.slide');
  await el.screenshot({ path: `${DIR}/${f}.png` });
  console.log('shot', f);
}
await b.close();
console.log('done');
