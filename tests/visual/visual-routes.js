const { discoverRoutes, snapshotNameForRoute, SITEMAP_PATH } = require('../test_utils');

const VISUAL_ROUTES = discoverRoutes()
    .map((route) => ({ route, name: snapshotNameForRoute(route) }));

if (VISUAL_ROUTES.length === 0) {
    throw new Error(`No visual routes found in ${SITEMAP_PATH}`);
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
