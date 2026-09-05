#!/usr/bin/env node
// Layout probe: records per-slide overflow + heading heights so a restyle can be diffed.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const FILE = process.argv[2];                 // e.g. pitch.html
const PORT = parseInt(process.argv[3], 10);
const OUT  = process.argv[4];
const root = process.cwd();
const vite = spawn(`${root}/node_modules/.bin/vite`, ['--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' });
process.on('exit', () => { try { vite.kill(); } catch {} });
const URL = `http://localhost:${PORT}/${FILE}`;
const t = Date.now();
while (Date.now() - t < 40000) { try { if ((await fetch(URL)).status < 500) break; } catch {} await new Promise(r => setTimeout(r, 400)); }
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.addInitScript(() => { try { sessionStorage.setItem('mm_briefing_access','1'); sessionStorage.setItem('mmh_access','1'); sessionStorage.setItem('hc_access','1'); } catch {} });
await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForFunction(() => window.Reveal && window.Reveal.isReady && window.Reveal.isReady(), null, { timeout: 30000 });
await p.evaluate(() => window.Reveal.configure({ transition: 'none', controls: false, progress: false, hash: false, history: false }));
await p.addStyleTag({ content: `.reveal *,.reveal *::before,.reveal *::after{animation-duration:0s!important;transition-duration:0s!important}` });
await p.evaluate(async () => { document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager'); await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 6000))]); });
await p.waitForTimeout(600);
const total = await p.evaluate(() => window.Reveal.getTotalSlides());
const rows = [];
for (let i = 0; i < total; i++) {
  await p.evaluate(idx => window.Reveal.slide(idx, 0, 0), i);
  await p.waitForTimeout(160);
  rows.push(await p.evaluate(idx => {
    const sec = window.Reveal.getCurrentSlide();
    const heads = [...sec.querySelectorAll('h1,h2,h3')].map(h => ({
      t: (h.textContent || '').trim().slice(0, 46), h: Math.round(h.getBoundingClientRect().height),
    }));
    return { i: idx, id: sec.id || '', over: Math.max(0, sec.scrollHeight - 720), heads };
  }, i));
}
writeFileSync(OUT, JSON.stringify(rows, null, 1));
console.log(`${FILE}: ${total} slides -> ${OUT}`);
await b.close(); process.exit(0);
