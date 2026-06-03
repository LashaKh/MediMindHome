#!/usr/bin/env node
// Three changes to healthycore.html, applied as one anchor-based splice:
//   1. Thank-you slide: "In the appendix" + 4 stale chips (Architecture / AI moments /
//      Safety / The SAFE explained) → "Up next" + 2 real chips (Live walkthrough / Architecture).
//   2. Thank-you speaker notes: drop the removed-slide list, name what actually follows.
//   3. Insert the LIVE PRODUCT WALKTHROUGH slide (iframe → /walkthrough) between the
//      Thank-you slide and the Architecture slide, and normalise the arch comment indent.
// Order will be: Thank you → Walkthrough → Architecture (last).
import { readFileSync, writeFileSync } from 'node:fs';

const HC = 'public/healthycore.html';
const hc = readFileSync(HC, 'utf8');

// ── Region 1: divider-tag + divider-chips ────────────────────────────────
const tagStart = hc.indexOf('<div class="divider-tag">');
const chipsOpen = hc.indexOf('<div class="divider-chips">', tagStart);
const chipsClose = hc.indexOf('</div>', chipsOpen) + '</div>'.length;
if (tagStart < 0 || chipsOpen < 0) throw new Error('divider tag/chips not found');
if (!hc.slice(tagStart, chipsClose).includes('AI moments')) throw new Error('chips block not the expected one');

const NEW1 = `<div class="divider-tag"><span class="lang-en">Up next</span><span class="lang-ka" style="display:none;">შემდეგ</span></div>
          <div class="divider-chips">
            <span class="divider-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/></svg><span class="lang-en">Live walkthrough</span><span class="lang-ka" style="display:none;">ცოცხალი დემო</span></span>
            <span class="divider-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg><span class="lang-en">Architecture</span><span class="lang-ka" style="display:none;">არქიტექტურა</span></span>
          </div>`;

// ── Region 2: Thank-you speaker notes ────────────────────────────────────
const NOTE_A = 'End of the main proposal.';
const NOTE_B = 'Happy to dwell on whichever you want to see more of.';
const start2 = hc.indexOf(NOTE_A);
const end2 = hc.indexOf(NOTE_B, start2) + NOTE_B.length;
if (start2 < 0 || end2 < NOTE_B.length) throw new Error('thank-you notes not found');
const NEW2 = 'End of the main proposal. Thank you. What follows is a live product walkthrough and the system architecture. Happy to dwell on whichever you want to see more of.';

// ── Region 3: insert walkthrough slide before the architecture comment ───
const archAnchor = hc.indexOf('APPENDIX A · five-layer architecture');
if (archAnchor < 0) throw new Error('architecture slide anchor not found');
const commentStart = hc.lastIndexOf('<!--', archAnchor);
const lineStart3 = hc.lastIndexOf('\n', commentStart) + 1;          // start of the comment line (eats stray indent)
const commentEnd3 = hc.indexOf('-->', archAnchor) + '-->'.length;   // end of the arch comment

const WALK = `      <!-- ═══════════════════════════════════════════════
           LIVE PRODUCT WALKTHROUGH — embedded /walkthrough page
           preview=1 bypasses the walkthrough's own password gate.
           ═══════════════════════════════════════════════ -->
      <section class="tour-slide">
        <iframe
          class="tour-iframe"
          src="/walkthrough?preview=1"
          title="MediMind live product walkthrough"
          loading="lazy"
          allow="autoplay; fullscreen"
        ></iframe>
        <button
          type="button"
          class="tour-skip"
          aria-label="Skip walkthrough and continue to the architecture"
          onclick="Reveal.next()"
        >Continue<span class="tour-skip-arrow" aria-hidden="true">→</span></button>
        <aside class="notes">
          Live product walkthrough embedded from /walkthrough — click play to start. To leave, click outside the iframe and press the right arrow (or the on-screen arrow) to continue to the architecture appendix.
        </aside>
      </section>

      <!-- ═══════════════════════════════════════════════
           APPENDIX A · five-layer architecture (isometric visual)
           ═══════════════════════════════════════════════ -->`;

// ── Assemble (regions are strictly ordered: chips < notes < arch) ────────
if (!(tagStart < chipsClose && chipsClose <= start2 && end2 <= lineStart3 && lineStart3 < commentEnd3))
  throw new Error('regions out of expected order — aborting');

const out =
  hc.slice(0, tagStart) + NEW1 +
  hc.slice(chipsClose, start2) + NEW2 +
  hc.slice(end2, lineStart3) + WALK +
  hc.slice(commentEnd3);

console.log('chips: 4 → 2 (Live walkthrough · Architecture)');
console.log('walkthrough slide inserted before architecture');
console.log('file size:', hc.length, '→', out.length);
writeFileSync(HC, out, 'utf8');
console.log('✅ wrote', HC);
