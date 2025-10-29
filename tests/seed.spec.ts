import { test } from '@playwright/test';

test('seed test for app exploration', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // Keep the page open for exploration
  await new Promise(resolve => setTimeout(resolve, 30000));
});