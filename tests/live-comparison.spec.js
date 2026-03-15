const { test, expect } = require('@playwright/test');
const { writeFileSync, mkdirSync } = require('node:fs');
const { dirname } = require('node:path');

const { SITE_ORIGIN, LOCAL_ORIGIN, discoverRoutes, snapshotNameForRoute } = require('./test_utils');

const routes = discoverRoutes();
const mismatchedRoutes = [];

if (routes.length === 0) {
    throw new Error('No routes found');
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
