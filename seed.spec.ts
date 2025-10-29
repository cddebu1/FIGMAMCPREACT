import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  // Keep browser open longer to explore
  await new Promise(resolve => setTimeout(resolve, 60000));
})();