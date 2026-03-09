const { test, expect } = require('@playwright/test');

const CORE_ROUTES = [
  '/',
  '/about/',
  '/blog/',
  '/posts/',
  '/projects/',
  '/links/',
  '/mentions/',
  '/posts/2014-11-14-remove-an-accidentally-pushed-remote-git-commit/',
];

test.describe('Core route smoke checks', () => {
  for (const route of CORE_ROUTES) {
    test(`route responds and renders: ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response, `No HTTP response for ${route}`).not.toBeNull();
      expect(response?.status(), `Unexpected HTTP status for ${route}`).toBeLessThan(400);
      await expect(page).toHaveTitle(/.+/);
    });
  }
});

test('internal links on core pages resolve', async ({ page, request, baseURL }) => {
  expect(baseURL, 'Playwright baseURL must be configured').toBeTruthy();

  const brokenLinks = [];
  const checked = new Set();

  for (const route of CORE_ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    const hrefs = await page.$$eval('a[href]', (anchors) =>
      anchors
        .map((a) => a.getAttribute('href') || '')
        .filter(Boolean)
    );

    for (const href of hrefs) {
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) {
        continue;
      }

      const resolved = new URL(href, `${baseURL}${route}`);

      if (resolved.origin !== baseURL) {
        continue;
      }

      // Ignore asset files that are not route pages.
      if (/\.(png|jpe?g|gif|svg|webp|ico|pdf|xml|txt|webmanifest)$/i.test(resolved.pathname)) {
        continue;
      }

      const normalized = `${resolved.origin}${resolved.pathname}`;
      if (checked.has(normalized)) {
        continue;
      }
      checked.add(normalized);

      const response = await request.get(normalized, {
        failOnStatusCode: false,
      });

      if (response.status() >= 400) {
        brokenLinks.push(`${normalized} (from ${route}) -> ${response.status()}`);
      }
    }
  }

  expect(brokenLinks, brokenLinks.join('\n')).toEqual([]);
});
