import { test } from '@playwright/test';

/**
 * Records the full 3-minute walkthrough page as a webm.
 *
 * Pre-flight:
 *   1. `npm run build`
 *   2. `npx vite preview --port 4173 &`  (or any host on RECORD_BASE_URL)
 *
 * Output:
 *   scripts/recordings/<test-id>/video.webm
 *
 * After recording, encode to MP4 with:
 *   ffmpeg -i scripts/recordings/.../video.webm \
 *     -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
 *     -b:v 3500k -maxrate 4000k -bufsize 6000k \
 *     -vf "fps=30,scale=1920:1080:flags=lanczos" \
 *     -movflags +faststart \
 *     public/walkthrough/medimind-demo.mp4
 */
test('record walkthrough', async ({ page }) => {
  // ?preview=1 bypasses the briefing gate (mirrors deck.html line 17–24).
  await page.goto('/walkthrough?preview=1');

  // Walkthrough auto-advances on mount. Total runtime is 180s exactly;
  // record an extra ~5s so the end card is fully captured.
  await page.waitForTimeout(186_000);
});
