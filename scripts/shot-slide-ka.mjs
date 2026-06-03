#!/usr/bin/env node
// Screenshot a slide with the Georgian (KA) language active, to verify the toggle.
// Usage: node scripts/shot-slide-ka.mjs <slideIndex> <outPath> [width] [height]
import { chromium } from 'playwright';
const [, , idxArg, outArg, wArg, hArg] = process.argv;
const index = Number(idxArg ?? 0);
const out = outArg ?? `/tmp/ka-${index}.png`;
const width = Number(wArg ?? 1280), height = Number(hArg ?? 720);
const URL = 'http://localhost:5173/healthycore.html?preview=1';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => window.Reveal && window.Reveal.isReady(), { timeout: 15000 });
// Activate Georgian: click the KA button if present, else toggle the body class.
await page.evaluate(() => {
  const btn = document.querySelector('.btn-ka');
  if (btn) btn.click();
  else { document.body.classList.remove('lang-active-en'); document.body.classList.add('lang-active-ka'); }
});
await page.evaluate((i) => window.Reveal.slide(i), index);
await page.waitForTimeout(2600);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out, `${width}x${height} (KA)`);
