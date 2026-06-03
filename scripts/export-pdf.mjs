#!/usr/bin/env node
// Export the Reveal.js pitch deck (public/deck.html) to a PDF.
// Swaps the live walkthrough iframe slide for a link card pointing
// to https://medimind.md/walkthrough, since iframes don't render in PDFs.

import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import net from 'node:net';

// `?preview=1` bypasses the deck's auth gate (see public/deck.html lines 7-26)
// WITHOUT triggering Reveal v4's Print module — Reveal only wraps sections in
// .pdf-page divs when it sees ?print-pdf, which would break our per-slide loop.
const DECK_PATH = '/deck.html?preview=1';
// We always spin up our OWN Vite on a unique port — never trust whatever
// happens to be on :5173 (another project may be squatting it).
const VITE_PORT = 5179;
const DEV_URL = `http://localhost:${VITE_PORT}`;
const OUT_PATH = '/Users/toko/Desktop/Pitch PDF/MediMind-Pitch.pdf';
const WALKTHROUGH_URL = 'https://medimind.md/walkthrough';

function log(...a) { console.log('[export-pdf]', ...a); }

function portInUse(port) {
  return new Promise((resolve) => {
    const s = net.createConnection({ port, host: '127.0.0.1' });
    s.once('connect', () => { s.end(); resolve(true); });
    s.once('error', () => resolve(false));
  });
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status < 500) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Dev server did not respond within ${timeoutMs}ms`);
}

let viteProc = null;
async function ensureDevServer() {
  if (await portInUse(VITE_PORT)) {
    throw new Error(`Port ${VITE_PORT} is in use — pick a different port in VITE_PORT.`);
  }
  log(`Starting Vite on :${VITE_PORT}…`);
  // fileURLToPath properly decodes %20 → space (vs .pathname which leaves it encoded).
  const repoRoot = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '');
  // Use the locally installed Vite binary directly — `spawn` doesn't search
  // PATH like a shell does, so `spawn('npx', ...)` and `spawn('vite', ...)`
  // both fail with ENOENT.
  const viteBin = `${repoRoot}/node_modules/.bin/vite`;
  viteProc = spawn(viteBin, ['--port', String(VITE_PORT), '--strictPort'], {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });
  viteProc.stdout.on('data', (d) => process.stdout.write(`[vite] ${d}`));
  viteProc.stderr.on('data', (d) => process.stderr.write(`[vite] ${d}`));
  await waitForServer(DEV_URL);
  log('Dev server is up.');
}

function killDevServer() {
  if (viteProc && !viteProc.killed) {
    try { viteProc.kill('SIGTERM'); } catch {}
  }
}
process.on('exit', killDevServer);
process.on('SIGINT', () => { killDevServer(); process.exit(130); });

async function main() {
  await ensureDevServer();

  const outDir = dirname(OUT_PATH);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  log('Launching Chromium…');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  log('Loading deck…');
  // 'domcontentloaded' over 'networkidle' — the deck fires a stream of
  // analytics beacons (and lazy-loads gallery images) that never settle,
  // so networkidle hangs indefinitely. We wait for Reveal to mount instead.
  const resp = await page.goto(`${DEV_URL}${DECK_PATH}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForSelector('.reveal .slides > section', { timeout: 60_000 });
  const allSectionCount = await page.evaluate(() => document.querySelectorAll('.reveal .slides > section').length);
  log(`Loaded "${await page.title()}" @ ${page.url()} — ${allSectionCount} slides.`);
  if (allSectionCount === 0) throw new Error('No Reveal slides found — wrong page rendered?');

  // Strategy: drive Reveal's own state machine — call Reveal.slide(i) before
  // each capture so the deck believes that slide is the "current" one. Reveal
  // then applies its own `.present` class, swaps the background layer, makes
  // .slide-inner fully visible, etc. We do NOT strip Reveal's inline styles
  // or hide sections ourselves — that previously broke .slide-inner visibility
  // and produced blank pages with just the section background showing.
  log('Waiting for Reveal to be ready + disabling transitions…');
  await page.waitForFunction(() => window.Reveal && window.Reveal.isReady && window.Reveal.isReady(), null, { timeout: 30_000 });
  await page.evaluate(() => {
    // Instant slide changes — no fade/slide animations between captures.
    window.Reveal.configure({
      transition: 'none',
      backgroundTransition: 'none',
      transitionSpeed: 'fast',
      controls: false,
      progress: false,
      // Disable hash sync so we don't get URL changes per slide.
      history: false,
      hash: false,
      // Don't auto-advance, don't loop.
      autoSlide: 0,
      loop: false,
      // Mouse-wheel triggers slide changes — disable so any stray scroll
      // during capture can't change the active slide.
      mouseWheel: false,
    });
  });

  // Minimal print-only CSS: hide chrome (controls/progress/notes/mobile
  // nav/lightbox). Everything else: trust Reveal.
  log('Hiding Reveal chrome for print…');
  await page.addStyleTag({ content: `
    @page { size: 1280px 720px; margin: 0; }
    /* Make sure body bg never shows around the deck (page-bleed safety). */
    html, body { margin: 0 !important; padding: 0 !important; background: #050b18 !important; }
    .reveal .controls,
    .reveal .progress,
    .reveal .playback,
    .reveal aside.notes,
    .reveal .speaker-notes,
    .mobile-nav,
    .gallery-lightbox { display: none !important; }
    /* Kill any CSS transitions/animations during capture for stability.
       transition-delay must be zeroed too — the deck staggers entrance
       animations with per-card delays (deck.html:1755-1759 etc.); without
       this, cards 3/4 of slide 4, rows 3+ of slide 5, later timeline
       markers, and 2nd/3rd price tiers stay invisible at capture time. */
    .reveal, .reveal *, .reveal-viewport, .reveal-viewport * {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      animation-duration: 0s !important;
      animation-delay: 0s !important;
    }
    /* Slide 7 (.gw-slide) — the .gw-stats blue box at the bottom was being
       clipped: its inner text (labels + sub-captions) overflowed the slide
       canvas because the 3 cards above used too much vertical room.
       Tighten the cards row + cards, slightly grow the box, then tighten the
       label/sub fonts so everything sits cleanly INSIDE the blue rectangle. */
    .reveal .gw-slide .gw-cards {
      gap: 10px !important;
      margin-bottom: 10px !important;
    }
    .reveal .gw-slide .gw-card {
      padding: 10px 14px !important;
    }
    .reveal .gw-slide .gw-card p {
      font-size: 0.62em !important;
      line-height: 1.4 !important;
    }
    .reveal .gw-slide .gw-card-head {
      margin-bottom: 4px !important;
    }
    .reveal .gw-slide .gw-stats {
      padding: 18px 16px 20px !important;
    }
    .reveal .gw-slide .gw-stat-label {
      letter-spacing: 0.06em !important;
      white-space: nowrap !important;
      font-size: 0.48em !important;
      margin-top: 4px !important;
    }
    .reveal .gw-slide .gw-stat-sub {
      white-space: nowrap !important;
      font-size: 0.40em !important;
    }
    .reveal .gw-slide .gw-footnotes {
      margin-top: 6px !important;
      font-size: 0.40em !important;
    }
    /* Cover slide: hide the "Prepared for [name]" container. The deck shows
       it as empty in generic mode because its stylesheet sets display to
       inline-flex, which beats the HTML hidden attribute. The footer row
       below already identifies the deck (author, pitch, date). */
    .reveal .cover .cover-prepared-for {
      display: none !important;
    }
  ` });

  log('Patching tour slide → link card…');
  await page.evaluate((walkthroughUrl) => {
    const slide = document.querySelector('section.tour-slide');
    if (!slide) return;

    // Remove iframe + skip button.
    slide.querySelectorAll('iframe.tour-iframe, button.tour-skip').forEach((el) => el.remove());

    // Match the .divider-slide aesthetic from deck.html so the new
    // page feels like part of the deck.
    slide.style.background = '#050b18';
    slide.style.color = '#e6edf7';
    slide.style.padding = '0';
    slide.style.overflow = 'visible';
    slide.style.display = 'flex';
    slide.style.alignItems = 'center';
    slide.style.justifyContent = 'center';

    const card = document.createElement('div');
    card.className = 'slide-inner center';
    card.style.cssText = `
      width: 100%; max-width: 1100px; padding: 64px;
      text-align: center; font-family: 'Inter', system-ui, sans-serif;
    `;
    card.innerHTML = `
      <div style="
        font-size: 14px; letter-spacing: 0.22em; text-transform: uppercase;
        color: #8aa0c2; margin-bottom: 28px; font-weight: 600;
      ">Live product walkthrough</div>

      <h1 style="
        font-size: 64px; line-height: 1.08; margin: 0 0 24px;
        font-weight: 600; color: #ffffff; letter-spacing: -0.02em;
      ">Watch the 3-minute demo.</h1>

      <div style="
        height: 1px; width: 88px; margin: 32px auto;
        background: linear-gradient(90deg, transparent, #4a6fa5, transparent);
      "></div>

      <p style="
        font-size: 20px; line-height: 1.5; color: #b9c6dc;
        margin: 0 auto 40px; max-width: 720px;
      ">An end-to-end walkthrough of the MediMind clinical workspace —
      voice-to-note, ICD-10 coding, prior-auth, and the patient timeline.</p>

      <a href="${walkthroughUrl}" style="
        display: inline-flex; align-items: center; gap: 14px;
        padding: 20px 36px; border-radius: 999px;
        background: linear-gradient(135deg, #4a6fa5 0%, #2d4a78 100%);
        color: #ffffff; text-decoration: none;
        font-size: 22px; font-weight: 600; letter-spacing: 0.01em;
        box-shadow: 0 12px 32px rgba(74,111,165,0.35), 0 2px 0 rgba(255,255,255,0.08) inset;
      ">
        <span>${walkthroughUrl.replace(/^https?:\/\//, '')}</span>
        <span aria-hidden="true" style="font-size: 24px; line-height: 1;">→</span>
      </a>

      <p style="
        margin: 32px 0 0; font-size: 13px; color: #6b7d99;
        letter-spacing: 0.04em;
      ">Use the investor password from your invite to unlock the walkthrough.</p>
    `;
    slide.appendChild(card);

    // Brand footer matching the deck's other slides.
    const footer = document.createElement('a');
    footer.className = 'brand-footer';
    footer.href = 'https://medimind.md';
    footer.target = '_blank';
    footer.rel = 'noopener noreferrer';
    footer.innerHTML = `<img src="/deck-assets/logo-icon-dark.svg" alt=""><span>medimind.md</span>`;
    slide.appendChild(footer);
  }, WALKTHROUGH_URL);

  log('Waiting for fonts + images (with hard timeouts)…');
  await page.evaluate(async () => {
    // Force lazy-loaded gallery images to load now — Chromium won't trigger
    // them in print mode otherwise (they're below the original viewport).
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });

    // Fonts — race against 8s so a stuck font doesn't deadlock the whole script.
    await Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 8000)),
    ]);

    // Images — wait at most 6s per image, then move on. A missing/broken image
    // is far better than a hung export.
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 6000);
      });
    }));
  });
  // Small settle buffer for any post-load layout (gradients, SVG filters).
  await page.waitForTimeout(1500);

  // Per-slide rendering loop: ask Reveal to navigate to slide i, settle,
  // capture a single-page PDF.
  const slideCount = await page.evaluate(() => window.Reveal.getTotalSlides());
  log(`Rendering ${slideCount} slides individually…`);

  // Find the tour-slide index — we'll need it after merge to add a
  // clickable URL annotation to that page in the final PDF.
  const tourSlideIndex = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('.reveal .slides > section'));
    return sections.findIndex((s) => s.classList.contains('tour-slide'));
  });
  log(`Tour-slide is section index ${tourSlideIndex}.`);

  const tmpRoot = join(tmpdir(), `medimind-pdf-${process.pid}`);
  if (existsSync(tmpRoot)) rmSync(tmpRoot, { recursive: true, force: true });
  mkdirSync(tmpRoot, { recursive: true });

  const pngFiles = [];
  for (let i = 0; i < slideCount; i++) {
    // 1. Tell Reveal to navigate to slide i.
    await page.evaluate((idx) => {
      window.Reveal.slide(idx, 0, 0);
      window.scrollTo(0, 0);
    }, i);

    // 2. Wait for the actual slidechanged event so we KNOW Reveal repainted —
    //    not an arbitrary timeout. Fallback timer covers the case where i ===
    //    current slide (no event will fire then).
    await page.evaluate(() => new Promise((resolve) => {
      let done = false;
      const fire = () => { if (done) return; done = true; window.Reveal.off('slidechanged', fire); resolve(); };
      window.Reveal.on('slidechanged', fire);
      setTimeout(fire, 400);
    }));

    // 3. Tiny settle so any post-paint work (gradients, image decode) finishes.
    await page.waitForTimeout(150);

    // 4. Screenshot — clipped to the deck's 1280x720 canvas. With viewport
    //    deviceScaleFactor: 2, the PNG is actually 2560x1440 physical pixels.
    const outFile = join(tmpRoot, `slide-${String(i).padStart(3, '0')}.png`);
    await page.screenshot({
      path: outFile,
      clip: { x: 0, y: 0, width: 1280, height: 720 },
      type: 'png',
    });
    pngFiles.push(outFile);
    if ((i + 1) % 5 === 0 || i === slideCount - 1) log(`  …rendered ${i + 1}/${slideCount}`);
  }

  await browser.close();

  // Merge PNGs into a single PDF using Pillow, then add a clickable URL
  // annotation to the tour-slide page using pypdf. Both libs live in a tiny
  // venv at scripts/.export-pdf-venv (created once with `python3 -m venv …`).
  log(`Merging ${pngFiles.length} PNGs into PDF → ${OUT_PATH}`);
  const repoRoot = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '');
  const venvPython = `${repoRoot}/scripts/.export-pdf-venv/bin/python`;
  const pyScript = `
import sys
from PIL import Image
import pypdf
from pypdf.annotations import Link
from pypdf.generic import Fit

# argv layout: [pngs..., tour_idx, walkthrough_url, out]
out = sys.argv[-1]
walkthrough_url = sys.argv[-2]
tour_idx = int(sys.argv[-3])
pngs = sys.argv[1:-3]

# 1) PNGs → multipage PDF via Pillow.
imgs = [Image.open(p).convert('RGB') for p in pngs]
imgs[0].save(out, 'PDF', save_all=True, append_images=imgs[1:], resolution=192.0)

# 2) Add a full-page clickable URL annotation to the tour-slide page.
#    PDF coords are bottom-up; page is 960x540 pt at our resolution.
if tour_idx >= 0:
    reader = pypdf.PdfReader(out)
    writer = pypdf.PdfWriter(clone_from=reader)
    writer.add_annotation(
        page_number=tour_idx,
        annotation=Link(rect=(0, 0, 960, 540), url=walkthrough_url),
    )
    with open(out, 'wb') as f:
        writer.write(f)
    print(f'Added clickable URL to page {tour_idx + 1}: {walkthrough_url}')
`;
  const merge = spawnSync(
    venvPython,
    ['-c', pyScript, ...pngFiles, String(tourSlideIndex), WALKTHROUGH_URL, OUT_PATH],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );
  if (merge.stdout) process.stdout.write(merge.stdout.toString());
  if (merge.status !== 0) {
    process.stderr.write(merge.stderr ? merge.stderr.toString() : '');
    throw new Error(`PDF merge+annotate failed with status ${merge.status}. Did the venv survive? (scripts/.export-pdf-venv)`);
  }

  rmSync(tmpRoot, { recursive: true, force: true });
  log('Done.');
}

main().catch((err) => {
  console.error('[export-pdf] FAILED:', err);
  process.exitCode = 1;
});
