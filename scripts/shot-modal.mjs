#!/usr/bin/env node
// Screenshot the case modal open on slide 6. Usage: node scripts/shot-modal.mjs <out> [w] [h]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = process.argv[2] ?? '/tmp/modal.png';
const W = parseInt(process.argv[3] ?? '1280', 10);
const H = parseInt(process.argv[4] ?? '720', 10);
const PORT = 5189;
const URL = `http://localhost:${PORT}/healthycore.html?preview=1`;
const repoRoot = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '');
const vite = spawn(`${repoRoot}/node_modules/.bin/vite`, ['--port', String(PORT), '--strictPort'], { cwd: repoRoot, stdio: ['ignore', 'ignore', 'ignore'] });
process.on('exit', () => { try { vite.kill('SIGTERM'); } catch {} });
async function waitFor(u, ms = 30000) { const s = Date.now(); while (Date.now() - s < ms) { try { const r = await fetch(u); if (r.status < 500) return; } catch {} await new Promise(r => setTimeout(r, 400)); } throw new Error('vite'); }
await waitFor(URL);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.reveal .slides > section', { timeout: 60000 });
await page.waitForFunction(() => window.Reveal && window.Reveal.isReady && window.Reveal.isReady(), null, { timeout: 30000 });
await page.evaluate(() => window.Reveal.configure({ transition: 'none', controls: false, progress: false }));
await page.evaluate(() => window.Reveal.slide(6, 0, 0));
await page.waitForTimeout(600);
await page.evaluate(() => window.openCaseModal());
await page.waitForTimeout(700);
await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: W, height: H }, type: 'png' });
await browser.close();
console.log('modal shot →', OUT);
process.exit(0);
