#!/usr/bin/env node
// Export the editable hospital proposal to one PDF per language.
// Start the local development server, then: node scripts/partner-pdf.mjs [ka en ru]
// Override the development URL with PARTNER_BASE_URL if necessary.
import { chromium } from 'playwright';
import { mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const languages = process.argv.slice(2).length ? process.argv.slice(2) : ['ka', 'en', 'ru'];
if (languages.some(lang => !['ka', 'en', 'ru'].includes(lang))) throw new Error('Languages must be ka, en or ru.');
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'public/share');
const base = process.env.PARTNER_BASE_URL || 'http://localhost:5173';
await mkdir(output, { recursive: true });
const health = await fetch(base + '/partner.html', { signal: AbortSignal.timeout(10000) });
if (!health.ok) throw new Error(`Development server returned ${health.status}.`);
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : { channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  for (const lang of languages) {
    await page.goto(`${base}/partner.html?print-pdf&lang=${lang}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map(img => img.decode()));
    });
    const pages = await page.evaluate(() => window.mmpTotal);
    const path = join(output, `medimind-partner-${lang}.pdf`);
    await page.pdf({ path, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true, tagged: true });
    console.log(`${lang}: ${pages} slides / ${Math.round((await stat(path)).size / 1024)} KB / ${path}`);
  }
} finally {
  await browser.close();
}
