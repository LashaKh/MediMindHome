#!/usr/bin/env node
// Generate two deck-assets from the source Healthycore logo:
//   healthycore-logo.svg        — full-colour original (lime + teal), for light backgrounds
//   healthycore-logo-white.svg  — one-colour white knockout, for dark backgrounds (cover, close)
// White version: override every fill class to #ffffff (the hidden .st0 group stays hidden).
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = '/Users/toko/Desktop/Healthycore.svg';
const OUT_DIR = 'public/deck-assets';
const src = readFileSync(SRC, 'utf8');

// 1 · colour original, verbatim
writeFileSync(`${OUT_DIR}/healthycore-logo.svg`, src, 'utf8');

// 2 · white knockout — recolour the four fill classes; keep display rules intact
const white = src
  .replace('.st2{fill:#ACC90D;}', '.st2{fill:#FFFFFF;}')
  .replace('.st3{fill:#009598;}', '.st3{fill:#FFFFFF;}')
  .replace('.st4{display:inline;fill:#ACC90D;}', '.st4{display:inline;fill:#FFFFFF;}')
  .replace('.st5{display:inline;fill:#009598;}', '.st5{display:inline;fill:#FFFFFF;}');

// sanity: all four originals must be gone
for (const c of ['#ACC90D', '#009598']) {
  if (white.includes(c)) throw new Error(`white version still contains ${c}`);
}
writeFileSync(`${OUT_DIR}/healthycore-logo-white.svg`, white, 'utf8');

console.log('✓ wrote healthycore-logo.svg (colour) and healthycore-logo-white.svg (white)');
