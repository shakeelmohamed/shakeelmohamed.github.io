const { test, expect } = require('@playwright/test');
const { PROJECT_ROUTES } = require('./visual-routes');

test.describe('Visual baseline snapshots: Projects', () => {
  for (const { route, name } of PROJECT_ROUTES) {
    test(`${name} page snapshot`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});