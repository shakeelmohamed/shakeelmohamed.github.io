const { test, expect } = require('@playwright/test');
const { createHash } = require('node:crypto');
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs');
const { resolve, dirname } = require('node:path');

const SITE_ORIGIN = 'https://shakeelmohamed.com';
const LOCAL_ORIGIN = 'http://localhost:8080';
const SITEMAP_PATH = resolve(process.cwd(), 'docs/sitemap.txt');

const routes = discoverRoutes();
const mismatchedRoutes = [];

if (routes.length === 0) {
  throw new Error(`No routes found in ${SITEMAP_PATH}`);
}

function discoverRoutes() {
  return readFileSync(SITEMAP_PATH, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url) => {
      try {
        return new URL(url);
      } catch {
        return null;
      }
    })
    .filter((url) => url && url.origin === SITE_ORIGIN)
    .map((url) => url.pathname)
    .filter((pathname, index, all) => all.indexOf(pathname) === index);
}

function snapshotNameForRoute(route) {
  const normalized = route === '/' ? 'home' : route.replace(/^\/+|\/+$/g, '').replace(/\//g, '__');
  const safe = normalized.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() || 'home';
  const short = safe.slice(0, 80);
  const hash = createHash('sha1').update(route).digest('hex').slice(0, 8);
  return `${short}--${hash}.png`;
}

async function stabilizePage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
      video, iframe {
        visibility: hidden !important;
      }
    `,
  });

  await page.waitForTimeout(500);
}

test.describe('Local vs live visual comparison', () => {
  test.afterAll(() => {
    if (mismatchedRoutes.length === 0) {
      console.log('\n[visual-compare] No visual differences detected.');
      return;
    }

    console.log('\n[visual-compare] Pages with visual differences:');
    for (const route of mismatchedRoutes) {
      console.log(`- ${route}`);
    }
  });

  for (const route of routes) {
    test(`compare ${route}`, async ({ browser }, testInfo) => {
      test.setTimeout(60_000);

      const localContext = await browser.newContext();
      const liveContext = await browser.newContext();

      try {
        const localPage = await localContext.newPage();
        const livePage = await liveContext.newPage();

        await stabilizePage(localPage, `${LOCAL_ORIGIN}${route}`);
        await stabilizePage(livePage, `${SITE_ORIGIN}${route}`);

        const localImage = await localPage.screenshot({
          fullPage: true,
          animations: 'disabled',
          caret: 'hide',
        });

        const liveImage = await livePage.screenshot({
          fullPage: true,
          animations: 'disabled',
          caret: 'hide',
        });

        const snapshotName = snapshotNameForRoute(route);
        const expectedPath = testInfo.snapshotPath(snapshotName);
        mkdirSync(dirname(expectedPath), { recursive: true });
        writeFileSync(expectedPath, liveImage);

        try {
          expect(localImage).toMatchSnapshot(snapshotName, {
            maxDiffPixelRatio: 0.05,
            threshold: 0.1,
          });
        } catch (error) {
          mismatchedRoutes.push(route);
          throw error;
        }
      } finally {
        await localContext.close();
        await liveContext.close();
      }
    });
  }
});
