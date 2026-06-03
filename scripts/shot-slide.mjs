#!/usr/bin/env node
// Quick single-slide screenshot helper for healthycore.html (Reveal deck).
// Usage: node scripts/shot-slide.mjs <slideIndex> <outPath> [width] [height]
// Uses the dev server already running on :5173.
import { chromium } from 'playwright';

const [, , idxArg, outArg, wArg, hArg] = process.argv;
const index = Number(idxArg ?? 1);
const out = outArg ?? `/tmp/slide-${index}.png`;
const width = Number(wArg ?? 1280);
const height = Number(hArg ?? 720);
const URL = 'http://localhost:5173/healthycore.html?preview=1';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => window.Reveal && window.Reveal.isReady(), { timeout: 15000 });
await page.evaluate((i) => window.Reveal.slide(i), index);
// entrance animations on .gw-slide run with delays up to ~1.9s
await page.waitForTimeout(2600);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out, `${width}x${height}`);
