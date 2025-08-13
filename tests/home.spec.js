// @ts-check
import { test, expect } from '@playwright/test';

// TODO: use this workflow for units
/*
const Eleventy = require("@11ty/eleventy");

test("Build generates pages", async () => {
  const elev = new Eleventy("src", "dist");
  await elev.write();

  const html = fs.readFileSync("dist/about/index.html", "utf8");
  expect(html).toContain("About Us");
});
 */

// TODO: check that all media links work
// - list dirs in ./docs
// - filter known dirs (.idea, about, blog, blog-archive, dist, gradshow, img, labyrinth, links, mentions, posts, projects, scripts)
// - remaining list is all media types
// ...
// - go through all projects, add mediatypes to a Set
// - check Set against media types form disk

test('homepage has title', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await expect(page).toHaveTitle("Shakeel Mohamed – Strategic Brand Designer in Los Angeles");
});


// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
