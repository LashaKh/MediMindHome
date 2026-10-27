#!/usr/bin/env node
// Focused visual check for the hospital proposal. Reuses the local development server.
// node scripts/partner-shots.mjs [ka|en|ru] [width=1280] [height=720] [output-directory]
import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const [, , lang = 'ka', width = '1280', height = '720', destination] = process.argv;
if (!['ka', 'en', 'ru'].includes(lang)) throw new Error('Language must be ka, en or ru.');
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = destination || join(root, `output/partner-v3/${lang}-${width}`);
await mkdir(out, { recursive: true });
const html = await readFile(join(root, 'public/partner.html'), 'utf8');
const password = html.match(/var PASSWORD = '([^']+)'/)[1];
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : { channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: +width, height: +height }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${process.env.PARTNER_BASE_URL || 'http://localhost:5173'}/partner.html?lang=${lang}`, { waitUntil: 'domcontentloaded' });
  await page.locator('#mmp-pass').fill(password);
  await page.locator('#mmp-form button').click();
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '.deck-nav{display:none!important}' });
  const total = await page.evaluate(() => window.mmpTotal);
  const findings = [];
  for (let index = 0; index < total; index++) {
    await page.evaluate(i => window.mmpGo(i), index);
    const slide = page.locator('.slide').nth(index);
    if (+width <= 820) await slide.screenshot({ path: join(out, `${String(index + 1).padStart(2, '0')}.png`) });
    else await page.screenshot({ path: join(out, `${String(index + 1).padStart(2, '0')}.png`) });
    findings.push(await slide.evaluate((section, number) => {
      const bounds = section.getBoundingClientRect();
      const text = [...section.querySelectorAll('h1,h2,h3,p,li,figcaption,td,th')];
      const outside = text.filter(element => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && (element.scrollWidth > element.clientWidth + 2 || box.left < bounds.left - 1 || box.right > bounds.right + 1 || box.bottom > bounds.bottom + 1);
      }).map(element => element.dataset.t || element.textContent.slice(0, 50));
      const inner = section.querySelector('.in');
      const blocks = [...inner.children].filter(element => {
        const style = getComputedStyle(element);
        return style.position !== 'absolute' && style.display !== 'none';
      });
      const overlaps = [];
      blocks.forEach((first, i) => blocks.slice(i + 1).forEach(second => {
        const a = first.getBoundingClientRect(), b = second.getBoundingClientRect();
        if (a.width && b.width && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) overlaps.push([first.className || first.tagName, second.className || second.tagName]);
      }));
      return { slide: number + 1, outside, overlaps };
    }, index));
  }
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  const report = { lang, width: +width, height: +height, slides: total, errors, horizontalOverflow, findings };
  await writeFile(join(out, 'layout.json'), JSON.stringify(report, null, 2));
  const problems = findings.filter(item => item.outside.length || item.overlaps.length);
  console.log(JSON.stringify({ lang, width, slides: total, errors, horizontalOverflow, problems, out }));
  if (errors.length || horizontalOverflow || problems.length) process.exitCode = 1;
} finally { await browser.close(); }
