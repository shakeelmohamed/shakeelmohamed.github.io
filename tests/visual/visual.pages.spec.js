const { test, expect } = require('@playwright/test');
const { PAGE_ROUTES } = require('./visual-routes');

test.describe('Visual baseline snapshots: Pages', () => {
  for (const { route, name } of PAGE_ROUTES) {
    test(`${name} page snapshot`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});