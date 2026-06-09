import { chromium } from 'playwright';
import { readFileSync, writeFileSync, statSync } from 'fs';
const FILE = '/Users/toko/Desktop/MediMind Landing Page/public/deck.html';
const base = 'http://localhost:5173';
const b = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await p.addInitScript(() => { try { sessionStorage.setItem('mm_briefing_access', '1'); } catch (e) {} });
await p.goto(base + '/deck.html', { waitUntil: 'load' });
await p.waitForFunction(() => window.Reveal && typeof window.Reveal.slide === 'function');
await p.evaluate(() => { const s=[...document.querySelectorAll('.reveal .slides > section')]; const i=s.findIndex(x=>x.classList.contains('csx-slide')); if(i>=0) window.Reveal.slide(i,0); });
await p.waitForTimeout(1500);
const out = await p.evaluate(() => {
  const rc = el => el.getBoundingClientRect();
  const spokes = rc(document.querySelector('.csx-spokes'));
  const vx = sx => (sx - spokes.left) / spokes.width * 100;
  const vy = sy => (sy - spokes.top) / spokes.height * 100;
  const hub = rc(document.querySelector('.csx-hub'));
  const brain = rc(document.querySelector('.csx-brain'));
  const neuro = rc(document.querySelector('.csx-neuro'));
  const outcomes = rc(document.querySelector('.csx-outcomes'));
  const sig = rc(document.querySelector('.csx-signal'));
  const anchorEl = document.querySelector('#csx-anchor');
  let anchorR, anchorL;
  if (anchorEl) {
    const aR = rc(anchorEl), aL = rc(document.querySelector('#csx-anchor-l'));
    anchorR = { x: vx(aR.left + aR.width/2), y: vy(aR.top + aR.height/2) };
    anchorL = { x: vx(aL.left + aL.width/2), y: vy(aL.top + aL.height/2) };
  } else {
    // image brain: anchor at the neuro img left/right edges, at the brain-body centre (~40% down, above the stem)
    const cy = neuro.top + neuro.height * 0.40;
    anchorR = { x: vx(neuro.right - 6), y: vy(cy) };
    anchorL = { x: vx(neuro.left + 6), y: vy(cy) };
  }
  const depts = [...document.querySelectorAll('.csx-dept')].map(d => {
    const r = rc(d);
    const bl = parseFloat(getComputedStyle(d).borderLeftWidth) || 0;
    return { dotVx: vx(r.left + bl - 10 + 3.5), dotVy: vy(r.top + r.height/2) };
  });
  return {
    geom: { hubH: Math.round(hub.height), neuroH: Math.round(neuro.height), neuroW: Math.round(neuro.width),
      brainH: Math.round(brain.height), overlap: Math.round(brain.bottom - outcomes.top) },
    anchorR, anchorL,
    sig: { x: vx(sig.right), y: vy(sig.top + sig.height/2) },
    depts,
  };
});
await b.close();
console.log('GEOM', JSON.stringify(out.geom));

const SX = out.anchorR.x, SY = out.anchorR.y;
const sX = SX.toFixed(2), sY = SY.toFixed(2);
const lines = [];
lines.push(`              <path class="csx-spoke-path" vector-effect="non-scaling-stroke" d="M${out.sig.x.toFixed(2)},${out.sig.y.toFixed(2)} L${out.anchorL.x.toFixed(2)},${out.anchorL.y.toFixed(2)}" stroke="#cbd5e1" stroke-width="1.3"/>`);
out.depts.forEach((d) => {
  const ex = d.dotVx.toFixed(2), ey = d.dotVy.toFixed(2);
  const c1x = (SX + 2).toFixed(2);
  const c2x = (d.dotVx - (d.dotVx - SX) * 0.4).toFixed(2);
  const c2y = (d.dotVy - (d.dotVy - SY) * 0.4).toFixed(2);
  lines.push(`              <path class="csx-spoke-path" vector-effect="non-scaling-stroke" d="M${sX},${sY} C${c1x},${sY} ${c2x},${c2y} ${ex},${ey}" stroke="url(#csxg)" stroke-width="1.4"/>`);
});
const NEWPATHS = lines.join('\n');

// CAS write: replace from the first spoke <path> to the spokes </svg>
const startA = '              <path class="csx-spoke-path"';
const endMark = '            </svg>';
for (let attempt = 0; attempt < 80; attempt++) {
  const m0 = statSync(FILE).mtimeMs;
  const s = readFileSync(FILE, 'utf8');
  const a = s.indexOf(startA);
  const z = s.indexOf(endMark, a);
  if (a === -1 || z === -1) { console.log('ABORT: spoke block markers not found'); process.exit(1); }
  const next = s.slice(0, a) + NEWPATHS + '\n' + s.slice(z);
  if (statSync(FILE).mtimeMs !== m0) { continue; }
  writeFileSync(FILE, next);
  console.log('OK: spokes rewritten (', out.depts.length, 'spokes + feed )');
  process.exit(0);
}
console.log('ABORT: file too busy'); process.exit(1);
