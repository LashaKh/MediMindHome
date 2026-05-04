import { defineConfig } from '@playwright/test';

/**
 * One-off Playwright config for the walkthrough video recording run.
 *
 *   cd "MediMind Landing Page"
 *   npm run build && npx vite preview --port 4173 &
 *   npx playwright test --config=scripts/record-walkthrough.config.ts
 *   # → recordings/<test-id>/video.webm
 */
export default defineConfig({
  testDir: '.',
  testMatch: /record-walkthrough\.spec\.ts$/,
  timeout: 240_000,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    // Use the production preview build for a clean recording (no Vite HMR).
    baseURL: process.env.RECORD_BASE_URL ?? 'http://localhost:4173',
    trace: 'off',
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  outputDir: './recordings',
});
