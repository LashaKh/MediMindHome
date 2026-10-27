import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome' });
const checks = [];
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:5173/hospitals.html?lang=ka#/meeting');
  await page.locator('#hc-pass').fill('medimind');
  await page.locator('#hc-form button').click();
  await page.waitForFunction(() => window.Reveal?.isReady() && Reveal.getCurrentSlide().id === 'meeting');
  checks.push('Password gate and direct Georgian meeting link');
  await page.evaluate(() => Reveal.configure({ transition: 'none', backgroundTransition: 'none' }));
  await page.addStyleTag({content: '.reveal *,.reveal *::before,.reveal *::after{animation:none!important;transition:none!important}'});
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Reveal.slide(0));
  await page.locator('.btn-en').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  await page.locator('.btn-ka').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'ka');
  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => Reveal.getCurrentSlide().id === 'daily-work');
  await page.locator('#daily-work').screenshot({path: 'output/hospitals-justina/ka-1280/01-daily-work.png'});
  assert.ok(await page.locator('#daily-work').evaluate(e => e.scrollHeight <= e.clientHeight + 2));
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(() => Reveal.getCurrentSlide().id === 'overview');
  checks.push('Language buttons, keyboard navigation, final opening slide fit');

  await page.evaluate(() => Reveal.slide(8));
  const links = await page.locator('.hjb-appendix-links a').evaluateAll(elements => elements.map(e => e.getAttribute('href')));
  for (const href of links) {
    await page.evaluate(() => Reveal.slide(8));
    await page.locator(`.hjb-appendix-links a[href="${href}"]`).click();
    await page.waitForFunction(id => Reveal.getCurrentSlide().id === id, href.slice(2));
  }
  checks.push(`All ${links.length} appendix links`);
  await page.evaluate(() => Reveal.slide(5));
  await page.locator('#offer .bm-proof-clickable').click();
  await page.waitForFunction(() => document.querySelector('#eco-modal').classList.contains('open') && document.querySelector('#eco-modal-video').readyState >= 2);
  const playback = await page.locator('#eco-modal-video').evaluate(e => ({duration: e.duration, readyState: e.readyState, error: e.error?.message}));
  assert.ok(playback.duration > 0 && !playback.error);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#eco-modal').classList.contains('open'));
  checks.push('TAVI demo loads, plays and closes');
  await page.evaluate(() => Reveal.slide(13));
  const product = page.locator('#products [data-video]').first();
  await product.click();
  await page.waitForFunction(() => document.querySelector('#eco-modal-video').readyState >= 2);
  await page.locator('.eco-modal-close').click();
  checks.push('Product demo loads and closes');

  for (const [lang, width, height] of [['ka', 390, 844], ['ka', 320, 568], ['en', 390, 844]]) {
    await page.setViewportSize({width, height});
    await page.evaluate(language => { mmSetLang(language); Reveal.slide(6); Reveal.layout(); }, lang);
    const slide = page.locator('#evaluation');
    await slide.evaluate(e => { e.scrollTop = 0; });
    const path = `output/hospitals-justina/evaluation-${lang}-${width}`;
    await slide.screenshot({path: `${path}.png`});
    await slide.evaluate(e => { e.scrollTop = e.querySelector('.hjb-scorecard').offsetTop - 20; });
    await slide.screenshot({path: `${path}-table.png`});
    const overflow = await slide.evaluate(section => [...section.querySelectorAll('th,td')].filter(e => e.getBoundingClientRect().width).some(e => e.scrollWidth > e.clientWidth + 2));
    assert.equal(overflow, false);
    checks.push(`Readable evaluation rows: ${lang}, ${width}px`);
  }
  assert.deepEqual(errors, []);
  const result = {checks, playback, errors};
  await writeFile('output/hospitals-justina/interactions.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
