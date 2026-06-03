#!/usr/bin/env node
// Quick single-slide screenshot harness for healthycore.html.
// Usage: node scripts/shot.mjs <slideIndex> <outPath> [width] [height]
// Spins up its own Vite on a unique port so it never collides with :5173.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SLIDE = parseInt(process.argv[2] ?? '0', 10);
const OUT = process.argv[3] ?? '/tmp/cover.png';
const W = parseInt(process.argv[4] ?? '1280', 10);
const H = parseInt(process.argv[5] ?? '720', 10);
const PORT = 5188;
const URL = `http://localhost:${PORT}/healthycore.html?preview=1`;

const repoRoot = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '');
const vite = spawn(`${repoRoot}/node_modules/.bin/vite`, ['--port', String(PORT), '--strictPort'], {
  cwd: repoRoot, stdio: ['ignore', 'ignore', 'ignore'],
});
process.on('exit', () => { try { vite.kill('SIGTERM'); } catch {} });

async function waitFor(url, ms = 30000) {
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
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.reveal .slides > section', { timeout: 60000 });
await page.waitForFunction(() => window.Reveal && window.Reveal.isReady && window.Reveal.isReady(), null, { timeout: 30000 });
await page.evaluate(() => window.Reveal.configure({ transition: 'none', controls: false, progress: false }));
await page.evaluate((i) => window.Reveal.slide(i, 0, 0), SLIDE);
await page.evaluate(async () => { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]); });
await page.waitForTimeout(1200);
await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: W, height: H }, type: 'png' });
await browser.close();
console.log('shot →', OUT);
process.exit(0);
