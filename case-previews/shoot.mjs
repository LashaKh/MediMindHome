import { chromium } from 'playwright';
import { readdirSync } from 'fs';

const DIR = '/Users/toko/Desktop/MediMind Landing Page/case-previews';
const files = readdirSync(DIR).filter(f => /^concept-[a-z]\.html$/.test(f)).sort();

const b = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 1340, height: 800 }, deviceScaleFactor: 2 });

for (const f of files) {
  await p.goto('file://' + DIR + '/' + f, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.waitForTimeout(1400);
  const el = await p.$('.slide');
  const out = DIR + '/' + f.replace('.html', '.png');
  await el.screenshot({ path: out });
  console.log('shot', f.replace('.html', '.png'));
}

await b.close();
console.log('done', files.length);
