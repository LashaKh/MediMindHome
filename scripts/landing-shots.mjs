#!/usr/bin/env node
// Verification harness for the React landing page ('/').
// Spins up its own Vite on a strict port, captures dark+light × desktop+mobile:
//   00-hero.png (lamp entrance) · NN-<section>.png (per-section) · zz-fullpage.png
// Usage: node scripts/landing-shots.mjs <tag>   (e.g. baseline, stage2, final)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const TAG = process.argv[2] ?? 'run';
const PORT = 5192;
const BASE = `http://localhost:${PORT}/`;
const OUTROOT = `/tmp/landing-shots/${TAG}`;

const SECTIONS = ['problem', 'path', 'platform', 'ai', 'safety', 'proof', 'cta'];
const THEMES = ['dark', 'light'];
const VIEWPORTS = [
  { w: 1600, h: 1000, tag: 'wide' },    // >=2xl — Light Thread labels visible
  { w: 1440, h: 900, tag: 'desktop' },  // <2xl — dots-only state
  { w: 390, h: 844, tag: 'mobile' },
];

const repoRoot = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '');
const vite = spawn(`${repoRoot}/node_modules/.bin/vite`, ['--port', String(PORT), '--strictPort'], {
  cwd: repoRoot, stdio: ['ignore', 'ignore', 'ignore'],
});
process.on('exit', () => { try { vite.kill('SIGTERM'); } catch {} });

async function waitFor(url, ms = 40000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try { const r = await fetch(url); if (r.status < 500) return; } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error('vite did not start');
}

await waitFor(BASE);
const browser = await chromium.launch({ headless: true });

for (const theme of THEMES) {
  for (const vp of VIEWPORTS) {
    const outdir = `${OUTROOT}/${theme}-${vp.tag}`;
    mkdirSync(outdir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1.25 });
    await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.evaluate(async () => { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 6000))]); });
    await page.waitForTimeout(1700); // lamp entrance (delay 0.3 + 0.8s) + settle

    // hero (top viewport)
    await page.screenshot({ path: `${outdir}/00-hero.png`, clip: { x: 0, y: 0, width: vp.w, height: vp.h } });

    // step-scroll to fire all once:true whileInView reveals
    const docH = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < docH; y += 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(280);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    // per-section
    let idx = 1;
    for (const id of SECTIONS) {
      const loc = page.locator('#' + id);
      if (await loc.count()) {
        try {
          await loc.scrollIntoViewIfNeeded();
          await page.waitForTimeout(350);
          await loc.screenshot({ path: `${outdir}/${String(idx).padStart(2, '0')}-${id}.png` });
        } catch { /* section shorter/absent at this viewport */ }
      }
      idx++;
    }

    // full page
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${outdir}/zz-fullpage.png`, fullPage: true });

    await ctx.close();
    console.log('captured', theme, vp.tag, '→', outdir);
  }
}
await browser.close();
console.log('done →', OUTROOT);
process.exit(0);
