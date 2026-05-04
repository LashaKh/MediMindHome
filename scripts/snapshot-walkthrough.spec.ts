import { test } from '@playwright/test';

// Snapshot the walkthrough at scene-relevant timestamps.
test('snapshot scenes', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/walkthrough?preview=1');
  await page.waitForLoadState('networkidle');

  // Scene 1 — first montage shot (~3s in)
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '/tmp/wt-snap/01-montage-shot1.png' });

  // Mid-montage (~6s in)
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/wt-snap/02-montage-shot4.png' });

  // First anchor scene — MediScribe (~14s in)
  await page.waitForTimeout(8500);
  await page.screenshot({ path: '/tmp/wt-snap/03-anchor-mediscribe.png' });
});
