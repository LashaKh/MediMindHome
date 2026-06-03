#!/usr/bin/env node
// Balance the MediMind × Healthycore lockups (cover + close seal):
//  - Healthycore was too big → size to ~equal WIDTH with MediMind (measured): cover 84→74px, close 36→31px.
//  - × spacing was asymmetric because the MediMind SVG has 16.1% trailing whitespace
//    (measured). Cancel it with a negative right-margin so the flex gap is symmetric.
//    Desktop row only — reset to 0 on mobile (column stack) so the logo stays centred.
import { readFileSync, writeFileSync } from 'node:fs';

const HC = 'public/healthycore.html';
let hc = readFileSync(HC, 'utf8');
function must(label, oldStr, newStr) {
  if (!hc.includes(oldStr)) throw new Error(`✗ NOT FOUND: ${label}`);
  if (hc.split(oldStr).length - 1 > 1) throw new Error(`✗ AMBIGUOUS: ${label}`);
  hc = hc.replace(oldStr, newStr); console.log(`✓ ${label}`);
}

// 1 · Cover MediMind logo — cancel 55px trailing whitespace (→ symmetric × gap)
must('cover MediMind margin-right -55',
  '.hc-lockup .cover-logo {\n      margin: 0; width: 340px; height: auto;',
  '.hc-lockup .cover-logo {\n      margin: 0 -55px 0 0; width: 340px; height: auto;');

// 2 · Cover Healthycore logo — 84 → 74px (≈ equal width to MediMind, 336 vs 340px)
must('cover Healthycore 84→74',
  '.hc-lockup .hc-partner-logo {\n      height: 84px; width: auto; margin: 0;',
  '.hc-lockup .hc-partner-logo {\n      height: 74px; width: auto; margin: 0;');

// 3 · Mobile — reset the negative margin so the stacked (column) logo stays centred
must('mobile margin reset',
  '      .hc-lockup .hc-partner-logo { height: 60px; }',
  '      .hc-lockup .hc-partner-logo { height: 60px; }\n      .hc-lockup .cover-logo { margin-right: 0; }');

// 4 · Close seal MediMind logo — cancel its 23px trailing whitespace
must('close MediMind margin-right -23',
  '.hc-close-logo { width: 142px; height: auto; opacity: 0.92; }',
  '.hc-close-logo { width: 142px; height: auto; opacity: 0.92; margin-right: -23px; }');

// 5 · Close seal Healthycore logo — 36 → 31px (≈ equal width to MediMind close logo)
must('close Healthycore 36→31',
  '.hc-close-hclogo { height: 36px; width: auto; opacity: 0.92; }',
  '.hc-close-hclogo { height: 31px; width: auto; opacity: 0.92; }');

writeFileSync(HC, hc, 'utf8');
console.log(`\n→ wrote ${HC}`);
