import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:5173/healthycore.html?preview=1', { waitUntil: 'load' });
await p.waitForFunction(() => window.Reveal && window.Reveal.isReady(), { timeout: 15000 });
await p.evaluate(() => window.Reveal.slide(0));
await p.waitForTimeout(1500);
const g = await p.evaluate(() => {
  const mm = document.querySelector('.hc-lockup .cover-logo').getBoundingClientRect();
  const x = document.querySelector('.hc-lockup .hc-cross').getBoundingClientRect();
  const hc = document.querySelector('.hc-lockup .hc-partner-logo').getBoundingClientRect();
  const mmVisRight = mm.right - 0.161 * mm.width;
  return {
    mmW: Math.round(mm.width), hcW: Math.round(hc.width), hcH: Math.round(hc.height),
    gap_MM_to_X: Math.round(x.left - mmVisRight),
    gap_X_to_HC: Math.round(hc.left - x.right),
  };
});
console.log(JSON.stringify(g));
await b.close();
