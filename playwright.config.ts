// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  use: {
    headless: !!process.env.CI,  // Headless in CI, headed locally
    viewport: { width: 1280, height: 720 },
    actionTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});