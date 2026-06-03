#!/usr/bin/env node
// Two changes to healthycore.html, one atomic read-replace-write:
//  A. Make the cover Healthycore logo proportional to MediMind (match wordmark cap-height):
//     cover 62→84px desktop, 46→60px mobile; close seal 34→36px.
//  B. Rename brand "Healthy Core" → "Healthycore" (one word) everywhere — the founder
//     confirmed the logo's one-word spelling wins. The "/healthycore.html" route has no
//     space so it is unaffected; EN and KA spans share the identical Latin string.
import { readFileSync, writeFileSync } from 'node:fs';

const HC = 'public/healthycore.html';
let hc = readFileSync(HC, 'utf8');

function must(label, oldStr, newStr) {
  if (!hc.includes(oldStr)) throw new Error(`✗ NOT FOUND: ${label}`);
  hc = hc.replaceAll(oldStr, newStr);
  console.log(`✓ ${label}`);
}

// A · proportions (exact CSS strings)
must('cover logo desktop 62→84',
  '.hc-lockup .hc-partner-logo {\n      height: 62px; width: auto; margin: 0;',
  '.hc-lockup .hc-partner-logo {\n      height: 84px; width: auto; margin: 0;');
must('cover logo mobile 46→60',
  '.hc-lockup .hc-partner-logo { height: 46px; }',
  '.hc-lockup .hc-partner-logo { height: 60px; }');
must('close seal 34→36',
  '.hc-close-hclogo { height: 34px; width: auto; opacity: 0.92; }',
  '.hc-close-hclogo { height: 36px; width: auto; opacity: 0.92; }');

// B · brand rename (global; count first for the log)
const renameCount = hc.split('Healthy Core').length - 1;
hc = hc.replaceAll('Healthy Core', 'Healthycore');
console.log(`✓ renamed "Healthy Core" → "Healthycore" (${renameCount} instances)`);

// guard: route/filename must stay intact, and no double-rename artifacts
if (hc.includes('Healthy Core')) throw new Error('rename incomplete');
if (hc.includes('Healthycorecore') || hc.includes('HealthyHealthycore')) throw new Error('rename artifact detected');

writeFileSync(HC, hc, 'utf8');
console.log(`\n→ wrote ${HC}`);
