#!/usr/bin/env node
// Measure the visible-content bounding boxes of both logo SVGs so the cover lockup
// can be sized + spaced precisely (no eyeballing).
//  - MediMind: bbox of its <text> (the "MediMind" wordmark) within viewBox 440×80.
//  - Healthycore: union bbox of all visible paths within viewBox 800×176, plus the
//    wordmark cap-height (the "H" letter) for size-matching.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

async function bboxOf(url, selector) {
  await page.goto(url, { waitUntil: 'load' });
  return page.evaluate((sel) => {
    const svg = document.querySelector('svg');
    const vb = svg.viewBox.baseVal;            // {x,y,width,height}
    const target = sel ? document.querySelector(sel) : svg;
    const b = target.getBBox();                // visible content bounds in user units
    return { vb: { w: vb.width, h: vb.height }, bbox: { x: b.x, y: b.y, w: b.width, h: b.height } };
  }, selector);
}

const mm = await bboxOf('http://localhost:5173/deck-assets/logo-horizontal-dark.svg', 'text');
const hc = await bboxOf('http://localhost:5173/deck-assets/healthycore-logo-white.svg', null);

// MediMind: trailing whitespace fraction + text cap-height fraction
const mmTrailFrac = (mm.vb.w - (mm.bbox.x + mm.bbox.w)) / mm.vb.w;
const mmLeadFrac = mm.bbox.x / mm.vb.w;
const mmCapFrac = mm.bbox.h / mm.vb.h;

// Healthycore: leading/trailing whitespace fraction of the whole logo
const hcLeadFrac = hc.bbox.x / hc.vb.w;
const hcTrailFrac = (hc.vb.w - (hc.bbox.x + hc.bbox.w)) / hc.vb.w;
const hcWordCapFrac = 78.2 / 176;             // "H" letter y=42.3→120.5, measured from source

console.log('── MediMind (viewBox', mm.vb.w + '×' + mm.vb.h, ') ──');
console.log('  text bbox:', JSON.stringify(mm.bbox));
console.log('  lead frac:', mmLeadFrac.toFixed(3), '| trail frac:', mmTrailFrac.toFixed(3), '| cap frac:', mmCapFrac.toFixed(3));
console.log('── Healthycore (viewBox', hc.vb.w + '×' + hc.vb.h, ') ──');
console.log('  content bbox:', JSON.stringify(hc.bbox));
console.log('  lead frac:', hcLeadFrac.toFixed(3), '| trail frac:', hcTrailFrac.toFixed(3), '| wordmark cap frac:', hcWordCapFrac.toFixed(3));

// ── Derive cover sizing ──
// MediMind cover-logo: width 340px → height = 340*(vb.h/vb.w)
const MM_W = 340;
const mmH = MM_W * (mm.vb.h / mm.vb.w);
const mmCapPx = mmCapFrac * mmH;
console.log('\n── Cover sizing (MediMind width', MM_W + 'px → height', mmH.toFixed(1) + 'px ) ──');
console.log('  MediMind wordmark cap ≈', mmCapPx.toFixed(1), 'px');
// Healthycore height so its wordmark cap matches MediMind's:
const hcHforEqualCap = mmCapPx / hcWordCapFrac;
console.log('  Healthycore height for EQUAL wordmark cap ≈', hcHforEqualCap.toFixed(1), 'px');
// Trailing whitespace to cancel (MediMind) at display width:
console.log('  MediMind trailing whitespace at 340px ≈', (mmTrailFrac * MM_W).toFixed(1), 'px  → cover-logo margin-right');
// Healthycore leading whitespace at a few candidate heights:
for (const H of [70, 74, 78, 84]) {
  const hcW = H * (hc.vb.w / hc.vb.h);
  console.log(`  HC @${H}px tall → width ${hcW.toFixed(0)}px, lead ws ${(hcLeadFrac*hcW).toFixed(1)}px, trail ws ${(hcTrailFrac*hcW).toFixed(1)}px, wordmark cap ${(hcWordCapFrac*H).toFixed(1)}px`);
}

await browser.close();
