const { test, expect } = require('@playwright/test');
const { POST_ROUTES } = require('./visual-routes');

test.describe('Posts', () => {
    for (const { route, name } of POST_ROUTES) {
        test(`${name} page snapshot`, async ({ page }) => {
            await page.goto(route, { waitUntil: 'networkidle' });
            await expect(page).toHaveScreenshot(`${name}.png`, {
                fullPage: true,
                maxDiffPixelRatio: 0.05,
                maxDiffPixelRatio: 0.1,
            });
        });
    }
});