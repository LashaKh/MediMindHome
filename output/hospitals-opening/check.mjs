import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const out = fileURLToPath(new URL('./', import.meta.url));
const browser = await chromium.launch({ channel: 'chrome' });
const reports = [];
try {
  for (const [lang, width, height] of [['ka',1280,720],['en',1280,720],['ka',390,844],['en',390,844],['ka',320,568],['ka',768,1024]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://localhost:5173/hospitals.html?lang=${lang}#/hospital-reality`, { waitUntil: 'domcontentloaded' });
    await page.locator('#hc-pass').fill('medimind');
    await page.locator('#hc-form button').click();
    await page.waitForFunction(() => window.Reveal?.isReady());
    await page.evaluate(() => { Reveal.configure({ transition: 'none', backgroundTransition: 'none' }); });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => Reveal.getCurrentSlide()?.id === 'hospital-reality');
    const slide = page.locator('#hospital-reality');
    const geometry = await slide.evaluate(section => {
      const rect = section.getBoundingClientRect();
      const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !el.closest('aside.notes'); };
      const candidates = [...section.querySelectorAll('[class^="hri"],h2,h3,p,figure')].filter(visible);
      const clipped = candidates.filter(el => { const b = el.getBoundingClientRect(); return b.left < rect.left - 2 || b.right > rect.right + 2 || (innerWidth > 768 && b.bottom > rect.bottom + 2); }).map(el => el.className || el.tagName);
      const overflow = candidates.filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.className || el.tagName);
      const main = section.querySelector('.hri-main').getBoundingClientRect();
      const closer = section.querySelector('.hri-closer').getBoundingClientRect();
      const evidence = section.querySelector('.hri-evidence').getBoundingClientRect();
      const study = section.querySelector('.hri-study').getBoundingClientRect();
      return { clipped, overflow, mainOverlapsCloser: main.bottom > closer.top, studyOverflowsPanel: study.bottom > evidence.bottom, scrollHeight: section.scrollHeight, clientHeight: section.clientHeight, text: section.innerText, totalSlides: Reveal.getTotalSlides(), language: document.documentElement.lang };
    });
    assert.equal(geometry.totalSlides, 18);
    assert.equal(geometry.language, lang);
    const prefix = `${lang}-${width}`;
    await page.screenshot({ path: `${out}${prefix}.png` });
    if (width <= 768) {
      const travel = geometry.scrollHeight - geometry.clientHeight;
      for (let top = Math.min(height - 100, travel), n = 1; travel > 0; top = Math.min(top + height - 100, travel), n++) {
        await slide.evaluate((el, y) => { el.scrollTop = y; }, top);
        await page.screenshot({ path: `${out}${prefix}-scroll-${n}.png` });
        if (top >= travel) break;
      }
      await slide.evaluate(el => { el.scrollTop = 0; });
    }
    if (width === 1280 && lang === 'ka') {
      const popupPromise = page.waitForEvent('popup');
      await page.locator('.hri-study a').click();
      const popup = await popupPromise;
      assert.equal(await page.evaluate(() => Reveal.getCurrentSlide().id), 'hospital-reality');
      await popup.close();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => Reveal.getCurrentSlide().classList.contains('hxd-slide'));
      await page.keyboard.press('ArrowLeft');
      await page.waitForFunction(() => Reveal.getCurrentSlide().id === 'hospital-reality');
      await page.keyboard.press('ArrowLeft');
      await page.waitForFunction(() => Reveal.getCurrentSlide().classList.contains('cover'));
      await page.getByRole('button', { name: 'ENG', exact: true }).click();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => Reveal.getCurrentSlide().id === 'hospital-reality');
      assert.equal(await page.locator('.hri-headline .lang-en').isVisible(), true);
      assert.equal(await page.locator('.hri-headline .lang-ka').isVisible(), false);
    }
    reports.push({ lang, width, height, errors, ...geometry });
    console.log(JSON.stringify({ lang, width, errors, clipped: geometry.clipped, overflow: geometry.overflow, mainOverlapsCloser: geometry.mainOverlapsCloser, studyOverflowsPanel: geometry.studyOverflowsPanel }));
    await page.close();
  }
  await writeFile(`${out}report.json`, JSON.stringify(reports, null, 2));
} finally { await browser.close(); }
