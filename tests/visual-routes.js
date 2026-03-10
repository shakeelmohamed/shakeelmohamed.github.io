const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const SITE_ORIGIN = 'https://shakeelmohamed.com';
const SITEMAP_PATH = resolve(process.cwd(), 'docs/sitemap.txt');

const VISUAL_ROUTES = readFileSync(SITEMAP_PATH, 'utf8')
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
  .filter((pathname, index, all) => all.indexOf(pathname) === index)
  .map((route) => ({ route, name: snapshotNameForRoute(route) }));

if (VISUAL_ROUTES.length === 0) {
  throw new Error(`No visual routes found in ${SITEMAP_PATH}`);
}

function snapshotNameForRoute(route) {
  const normalized = route === '/' ? 'home' : route.replace(/^\/+|\/+$/g, '').replace(/\//g, '__');
  const safe = normalized.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() || 'home';
  const short = safe.slice(0, 80);
  const hash = createHash('sha1').update(route).digest('hex').slice(0, 8);
  return `${short}--${hash}.png`;
}

const PROJECT_ROUTES = VISUAL_ROUTES.filter(({ route }) => route.includes('/projects/'));
const POST_ROUTES = VISUAL_ROUTES.filter(({ route }) => route.includes('/posts/'));
const PAGE_ROUTES = VISUAL_ROUTES.filter(
  ({ route }) => !route.includes('/projects/') && !route.includes('/posts/'),
);

module.exports = {
  PROJECT_ROUTES,
  POST_ROUTES,
  PAGE_ROUTES,
};