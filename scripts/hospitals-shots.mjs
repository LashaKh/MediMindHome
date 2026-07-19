#!/usr/bin/env node
// Verification harness: screenshot every visible slide of hospitals.html.
// Spins up its own Vite on a unique port. Output → /tmp/hospitals-shots-<TAG>/NN.png
// Usage: node scripts/hospitals-shots.mjs [width] [height] [tag] [lang]
//   lang: "en" (default) or "ka" — flips the deck's bilingual toggle before shooting.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const W = parseInt(process.argv[2] ?? '1280', 10);
const H = parseInt(process.argv[3] ?? '720', 10);
const TAG = process.argv[4] ?? 'd';            // label for output dir
const LANG = process.argv[5] ?? 'en';
const PORT = 5192;
const URL = `http://localhost:${PORT}/hospitals.html`;
const OUTDIR = `/tmp/hospitals-shots-${TAG}`;
mkdirSync(OUTDIR, { recursive: true });

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

await waitFor(URL);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
const page = await ctx.newPage();
// Pre-unlock the shared password gate (sessionStorage key set before any script runs).
await page.addInitScript(() => { try { sessionStorage.setItem('mmh_access', '1'); } catch {} });
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.reveal .slides > section', { timeout: 60000 });
await page.waitForFunction(() => window.Reveal && window.Reveal.isReady && window.Reveal.isReady(), null, { timeout: 30000 });
await page.evaluate(() => window.Reveal.configure({ transition: 'none', backgroundTransition: 'none', controls: false, progress: false, hash: false, history: false }));
await page.addStyleTag({ content: `.reveal *,.reveal *::before,.reveal *::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}.mobile-nav,.controls,.progress{display:none!important}` });
await page.evaluate(async () => { document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager'); await Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,5000))]); });
if (LANG === 'ka') await page.evaluate(() => window.mmSetLang && window.mmSetLang('ka'));
await page.waitForTimeout(800);

const total = await page.evaluate(() => window.Reveal.getTotalSlides());
console.log('total visible slides:', total);
for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => window.Reveal.slide(idx, 0, 0), i);
  await page.waitForTimeout(350);
  const out = `${OUTDIR}/${String(i).padStart(2,'0')}.png`;
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: W, height: H } });
}
await browser.close();
console.log('done →', OUTDIR);
process.exit(0);
