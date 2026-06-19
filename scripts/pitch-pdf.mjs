#!/usr/bin/env node
// Generate a PDF of pitch.html — screenshots every VISIBLE slide and
// assembles them one-per-page into a 16:9 (1280x720) PDF.
// Usage: node scripts/pitch-pdf.mjs [outPath] [skipIndicesCSV]
//   e.g. node scripts/pitch-pdf.mjs ~/Desktop/MediMind-Pitch.pdf 12
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = process.argv[2] || '/Users/toko/Desktop/MediMind-Pitch.pdf';
const SKIP = new Set((process.argv[3] || '').split(',').filter(Boolean).map(Number));
const W = 1280, H = 720, SCALE = 2;
const PORT = 5193;
const URL = `http://localhost:${PORT}/pitch.html`;
const FRAMES = '/tmp/pitch-pdf-frames';
mkdirSync(FRAMES, { recursive: true });

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
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.reveal .slides > section', { timeout: 60000 });
await page.waitForFunction(() => window.Reveal && window.Reveal.isReady && window.Reveal.isReady(), null, { timeout: 30000 });
await page.evaluate(() => window.Reveal.configure({ transition: 'none', backgroundTransition: 'none', controls: false, progress: false, hash: false, history: false }));
await page.addStyleTag({ content: `.reveal *,.reveal *::before,.reveal *::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}.mobile-nav,.controls,.progress{display:none!important}` });
await page.evaluate(async () => { document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager'); await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 5000))]); });
await page.waitForTimeout(800);

const total = await page.evaluate(() => window.Reveal.getTotalSlides());
const frames = [];
for (let i = 0; i < total; i++) {
  if (SKIP.has(i)) continue;
  await page.evaluate((idx) => window.Reveal.slide(idx, 0, 0), i);
  await page.waitForTimeout(i === 12 ? 2500 : 400); // give the walkthrough iframe extra time
  const f = `${FRAMES}/${String(i).padStart(2, '0')}.png`;
  await page.screenshot({ path: f, clip: { x: 0, y: 0, width: W, height: H } });
  frames.push(f);
}
console.log('captured', frames.length, 'of', total, 'slides');

// Assemble PNGs into a one-slide-per-page PDF via a local file:// page.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: ${W}px ${H}px; margin: 0; }
  * { margin: 0; padding: 0; }
  html, body { background: #fff; }
  .pg { width: ${W}px; height: ${H}px; page-break-after: always; overflow: hidden; }
  .pg:last-child { page-break-after: auto; }
  img { width: ${W}px; height: ${H}px; display: block; }
</style></head><body>
  ${frames.map((f) => `<div class="pg"><img src="file://${f}"></div>`).join('\n')}
</body></html>`;
writeFileSync(`${FRAMES}/index.html`, html);

const pdfPage = await ctx.newPage();
await pdfPage.goto(`file://${FRAMES}/index.html`, { waitUntil: 'load', timeout: 120000 });
await pdfPage.emulateMedia({ media: 'print' });
await pdfPage.pdf({ path: OUT, width: `${W}px`, height: `${H}px`, printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('PDF →', OUT);
process.exit(0);
