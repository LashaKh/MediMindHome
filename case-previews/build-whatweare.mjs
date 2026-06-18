import { readFileSync, writeFileSync } from 'fs';

const SRC = '/Users/toko/Desktop/MediMind Landing Page/public/pitch.html';
const DIR = '/Users/toko/Desktop/MediMind Landing Page/case-previews';
const html = readFileSync(SRC, 'utf8');

// --- extract the real floor-plan SVG + the scope-slide headline verbatim ---
const secStart = html.indexOf('<section class="cat-slide scope-slide">');
const svgStart = html.indexOf('<svg viewBox="0 0 1100 326"', secStart);
const svgEnd = html.indexOf('</svg>', svgStart) + '</svg>'.length;
const SVG = html.slice(svgStart, svgEnd);
const headline = html.slice(secStart).match(/<h2 class="headline-big">[\s\S]*?<\/h2>/)[0];

// SVG variant: foundation bar removed, viewBox cropped, gray uppercase sub-lines stripped
const SVG_A = SVG
  .replace(/\s*<g class="fp-foundation">[\s\S]*?<\/g>/, '')
  .replace(/\s*<text class="fp-room-std"[^>]*fill:var\(--emr-text-light\)[^>]*>[^<]*<\/text>/g, '')
  .replace('viewBox="0 0 1100 326"', 'viewBox="0 0 1100 290"');

// --- the 7 rooms that fire, in clinical sequence (x,y,w,h + ray edge target + action) ---
const FIRE = [
  { k: 'ER',       x: 24,  y: 12,  w: 192, h: 68,  tx: 216, ty: 72,  act: 'ER pathway' },
  { k: 'LAB',      x: 24,  y: 92,  w: 192, h: 106, tx: 216, ty: 145, act: 'Lipase ordered' },
  { k: 'PACS',     x: 880, y: 12,  w: 192, h: 68,  tx: 884, ty: 72,  act: 'CT ordered' },
  { k: 'PHARMACY', x: 880, y: 92,  w: 192, h: 106, tx: 884, ty: 145, act: 'Fluids started' },
  { k: 'OR',       x: 452, y: 12,  w: 192, h: 68,  tx: 548, ty: 80,  act: 'Surgery paged' },
  { k: 'ICU',      x: 238, y: 12,  w: 192, h: 68,  tx: 424, ty: 78,  act: 'ICU bed ready' },
  { k: 'BILLING',  x: 238, y: 218, w: 192, h: 68,  tx: 424, ty: 224, act: 'Billing cleared' },
];
const CORE = { x: 547, y: 145 };

const ray = (r) => `<path class="fpx-ray" d="M${CORE.x},${CORE.y} L${r.tx},${r.ty}"/>`;
const litRect = (r, cls) => `<rect class="${cls}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="7"/>`;
const checkBadge = (r) =>
  `<g class="fpx-badge" transform="translate(${r.x + r.w - 19},${r.y + 6})"><circle cx="6.5" cy="6.5" r="7.5"/><path d="M3.2,6.7 L5.4,8.9 L9.8,4.3"/></g>`;

const overlayA = `
  <g class="fpx">
    ${FIRE.map(ray).join('\n    ')}
    ${FIRE.map(r => litRect(r, 'fpx-glow')).join('\n    ')}
    ${FIRE.map(r => litRect(r, 'fpx-wash')).join('\n    ')}
    ${FIRE.map(r => litRect(r, 'fpx-ring')).join('\n    ')}
    ${FIRE.map(checkBadge).join('\n    ')}
    <g class="fpx-catch" transform="translate(${CORE.x},108)">
      <rect class="fpx-catch-pill" x="-72" y="-11" width="144" height="22" rx="11"/>
      <circle class="fpx-catch-dot" cx="-56" cy="0" r="4"/>
      <text class="fpx-catch-tx" x="6" y="3.5" text-anchor="middle">Pancreatitis — caught</text>
    </g>
  </g>`;

const legendA = `<div class="fpx-legend">
  <span class="fpx-legend-h">Picture 2&nbsp;a.m.</span>
  ${FIRE.map((r, i) => `<span class="fpx-legend-step"><i>${i + 1}</i>${r.act}</span>`).join('\n  ')}
  <span class="fpx-legend-f">Not one alert — the entire response.</span>
</div>`;

const baseCSS = `
  :root{
    --emr-primary:#1a365d; --emr-secondary:#2b6cb0; --emr-accent:#3182ce; --emr-light-accent:#bee3f8;
    --emr-bg-page:#fff; --emr-bg-subtle:#f8fafc; --emr-bg-tint:#f0f7ff;
    --emr-text-primary:#1a365d; --emr-text-body:#334155; --emr-text-muted:#64748b; --emr-text-light:#94a3b8; --emr-border:#e2e8f0;
    --emr-gradient-primary:linear-gradient(135deg,#1a365d 0%,#2b6cb0 50%,#3182ce 100%);
    --csb-red:#d83a3a;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{height:100%;background:#e9edf2;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;}
  body{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;}
  .slide{position:relative;width:1280px;height:720px;flex:none;background:#fff;border-radius:16px;box-shadow:0 24px 70px -24px rgba(26,54,93,.28);overflow:hidden;font-size:22px;color:var(--emr-text-body);}
  .slide-inner{height:100%;padding:60px 90px 54px;display:flex;flex-direction:column;}
  .headline-big{font-size:2.2em;font-weight:800;line-height:1.08;letter-spacing:-.03em;color:var(--emr-text-primary);margin:0;}
  .headline-big em{font-style:normal;background:var(--emr-gradient-primary);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
  .headline-sub{font-size:.86em;line-height:1.4;color:var(--emr-text-muted);margin:12px 0 0;max-width:980px;}
  .headline-sub strong{color:var(--emr-text-body);font-weight:700;} .headline-sub em{font-style:normal;color:var(--emr-secondary);font-weight:600;}

  .fp-wrap{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:16px;}
  .floor-plan{position:relative;width:calc(100% + 140px);margin:0 -70px;padding:4px 4px 0;border-radius:14px;
    background:radial-gradient(ellipse 55% 70% at 50% 50%,rgba(49,130,206,.10) 0%,rgba(49,130,206,.04) 45%,transparent 78%);}
  .floor-plan svg{width:100%;height:auto;display:block;overflow:visible;}
  .fp-room-shadow{fill:rgba(15,32,58,.10);filter:blur(4px);}
  .fp-room-bg{fill:url(#fpRoomGrad);stroke:rgba(190,227,248,.85);stroke-width:1;}
  .fp-room-accent{fill:url(#fpRoomAccent);opacity:.92;}
  .fp-room-icon{stroke:var(--emr-secondary);fill:none;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round;}
  .fp-room-icon-dot{fill:var(--emr-secondary);stroke:none;}
  .fp-room-name{font-weight:800;font-size:13px;fill:var(--emr-text-primary);letter-spacing:.06em;}
  .fp-room-std{font-weight:600;font-size:9.5px;fill:#475569;letter-spacing:.005em;}
  .fp-room-std-star{fill:var(--emr-accent);}
  .fp-brain-shadow{fill:rgba(15,32,58,.30);filter:blur(8px);}
  .fp-brain-bg{fill:url(#fpBrainGrad);stroke:rgba(190,227,248,.30);stroke-width:1;}
  .fp-brain-pattern{fill:url(#fpBrainPattern);opacity:.55;}
  .fp-brain-aura{fill:url(#fpBrainAura);animation:fpAura 3.4s ease-in-out infinite;}
  .fp-brain-core{fill:url(#fpBrainCore);transform-origin:center;transform-box:fill-box;animation:fpPulse 3.4s ease-in-out infinite;}
  .fp-brain-ring{fill:none;stroke:rgba(190,227,248,.55);stroke-width:1.2;}
  .fp-brain-ring.r1{stroke-dasharray:3 3;animation:fpRing 3.4s ease-out infinite;}
  .fp-brain-ring.r2{stroke-dasharray:2 4;opacity:.55;animation:fpRing 3.4s ease-out infinite 1.1s;}
  .fp-brain-ring.r3{stroke-dasharray:1 5;opacity:.30;animation:fpRing 3.4s ease-out infinite 2.2s;}
  .fp-brain-title{font-weight:800;font-size:22px;fill:#fff;letter-spacing:.22em;text-anchor:middle;}
  @keyframes fpPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
  @keyframes fpRing{0%{r:38px;opacity:.65;}100%{r:92px;opacity:0;}}
  @keyframes fpAura{0%,100%{opacity:.55;}50%{opacity:.85;}}

  /* cascade overlay */
  .fpx-ray{stroke:var(--emr-accent);stroke-width:1.9;fill:none;opacity:.85;stroke-dasharray:5 4;filter:drop-shadow(0 0 1.5px rgba(49,130,206,.5));animation:fpxFlow 1.1s linear infinite;}
  @keyframes fpxFlow{to{stroke-dashoffset:-18;}}
  .fpx-glow{fill:none;stroke:var(--emr-accent);stroke-width:7;opacity:.15;filter:blur(3px);}
  .fpx-wash{fill:rgba(49,130,206,.08);stroke:none;}
  .fpx-ring{fill:none;stroke:var(--emr-accent);stroke-width:2.4;}
  .fpx-badge circle{fill:var(--emr-accent);}
  .fpx-badge path{fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}
  .fpx-catch-pill{fill:#fff;stroke:var(--csb-red);stroke-width:1.3;}
  .fpx-catch-dot{fill:var(--csb-red);}
  .fpx-catch-tx{font-size:11px;font-weight:800;fill:var(--csb-red);letter-spacing:.01em;}

  /* response legend (in place of the foundation bar) */
  .fpx-legend{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:9px 14px;margin:0 -50px;padding:12px 22px;border-radius:13px;
    background:linear-gradient(135deg,#0f2947 0%,#1a365d 55%,#2b6cb0 100%);box-shadow:0 10px 24px -10px rgba(15,32,58,.5);}
  .fpx-legend-h{font-size:.5em;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--emr-light-accent);}
  .fpx-legend-step{display:inline-flex;align-items:center;gap:7px;font-size:.6em;font-weight:700;color:#fff;}
  .fpx-legend-step i{width:17px;height:17px;border-radius:50%;background:rgba(190,227,248,.18);color:#fff;font-style:normal;font-size:10px;font-weight:800;display:grid;place-items:center;border:1px solid rgba(190,227,248,.45);}
  .fpx-legend-f{font-size:.58em;font-weight:800;color:var(--emr-light-accent);}
`;

const page = (title, svg, overlay, below = '') => `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${baseCSS}</style></head>
<body><div class="slide"><div class="slide-inner">
${headline}
<p class="headline-sub"><strong>Picture the 2&nbsp;a.m. case</strong> — one signal, and the whole hospital moves <em>as one</em>.</p>
<div class="fp-wrap">
  <div class="floor-plan">${svg.replace('</svg>', overlay + '\n</svg>')}</div>
  ${below}
</div>
</div></div></body></html>`;

writeFileSync(`${DIR}/whatweare-a.html`, page('WhatWeAre A — lights up + legend', SVG_A, overlayA, legendA));
console.log('built A (7 rooms + legend)');
