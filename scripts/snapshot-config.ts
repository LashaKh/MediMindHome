import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.',
  testMatch: /snapshot-walkthrough\.spec\.ts$/,
  timeout: 60_000,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1920, height: 1080 },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
