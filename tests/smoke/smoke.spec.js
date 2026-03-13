const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function getFilesRecursively(dirPath, filterFn) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(fullPath, filterFn));
      continue;
    }
    if (!filterFn || filterFn(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

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

test('sitemap lastmod values are valid ISO dates', async () => {
  const sitemapPath = path.resolve(process.cwd(), 'docs', 'sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const matches = [...xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)];

  expect(matches.length, 'Expected at least one <lastmod> in sitemap.xml').toBeGreaterThan(0);

  for (const [, rawValue] of matches) {
    const value = rawValue.trim();
    expect(value, 'Each <lastmod> must be non-empty').toBeTruthy();
    expect(value, `<lastmod> must be YYYY-MM-DD, got: ${value}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const parsed = new Date(`${value}T00:00:00Z`);
    expect(Number.isNaN(parsed.getTime()), `Invalid date in <lastmod>: ${value}`).toBeFalsy();

    const normalized = parsed.toISOString().slice(0, 10);
    expect(normalized, `Invalid calendar date in <lastmod>: ${value}`).toBe(value);
  }
});

test('post listing dates are present and ISO-formatted', async () => {
  const listingPaths = [
    path.resolve(process.cwd(), 'docs', 'posts', 'index.html'),
    path.resolve(process.cwd(), 'docs', 'blog', 'index.html'),
    path.resolve(process.cwd(), 'docs', 'blog-archive', 'index.html'),
  ];

  for (const listingPath of listingPaths) {
    const html = fs.readFileSync(listingPath, 'utf8');
    const matches = [
      ...html.matchAll(
        /<div class="block-post-list-date">\s*<p(?: class="[^"]*")?>\s*([^<]*)\s*&nbsp;<\/p>/g,
      ),
    ];

    expect(matches.length, `Expected listing date rows in ${listingPath}`).toBeGreaterThan(0);

    for (const [, rawDate] of matches) {
      const date = (rawDate || '').trim();
      expect(date, `Date is empty in ${listingPath}`).toBeTruthy();
      expect(date, `Date must be YYYY-MM-DD in ${listingPath}, got: ${date}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test('post pages include non-empty og:article:published_time', async () => {
  const postsDir = path.resolve(process.cwd(), 'docs', 'posts');
  const postFiles = getFilesRecursively(postsDir, (filePath) => filePath.endsWith('index.html') && !filePath.endsWith(path.join('posts', 'index.html')));

  expect(postFiles.length, 'Expected generated post HTML files').toBeGreaterThan(0);

  for (const postFile of postFiles) {
    const html = fs.readFileSync(postFile, 'utf8');
    const match = html.match(/<meta property="og:article:published_time"(?:\s+content="([^"]*)")?\s*\/?>(?:<\/meta>)?/i);

    expect(match, `Missing og:article:published_time in ${postFile}`).toBeTruthy();

    const value = (match[1] || '').trim();
    expect(value, `Empty og:article:published_time in ${postFile}`).toBeTruthy();
    expect(value, `og:article:published_time must be YYYY-MM-DD in ${postFile}, got: ${value}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
});
