const { createHash } = require('node:crypto');
const { readdirSync, readFileSync } = require('node:fs');
const { resolve, dirname, join, extname } = require('node:path');

const SITE_ORIGIN = 'https://shakeelmohamed.com';
const LOCAL_ORIGIN = 'http://localhost:8080';
const DOCS_DIR = resolve(process.cwd(), 'docs');
const SRC_DIR = resolve(process.cwd(), 'src');
const SITEMAP_PATH = resolve(process.cwd(), 'docs/sitemap.txt');
const SOURCE_REFERENCE_FILE_EXTENSIONS = new Set(['.pug', '.js', '.json', '.md', '.txt', '.webmanifest', '.xml', '.yml', '.yaml']);
const SOURCE_IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg']);

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

function getFilesRecursively(dirPath, filterFn) {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
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

function listHtmlFilesRecursively(dirPath) {
    return getFilesRecursively(dirPath, (fullPath) => fullPath.endsWith('.html'));
}

function listSourceImageFilesRecursively(dirPath) {
    return getFilesRecursively(dirPath, (fullPath) => /\.(png|jpg|jpeg|gif|svg)$/i.test(fullPath));
}

function listSourceReferenceFilesRecursively(dirPath) {
    return getFilesRecursively(
        dirPath,
        (fullPath) => SOURCE_REFERENCE_FILE_EXTENSIONS.has(extname(fullPath).toLowerCase()),
    );
}

function isLocalAssetUrl(value) {
    if (!value) return false;
    return !(value.startsWith('http://') || value.startsWith('https://') || value.startsWith('//') || value.startsWith('data:') || value.startsWith('#'));
}

function splitSrcsetValues(srcset) {
    return srcset.split(',').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean);
}

function normalizeAssetUrl(urlValue) {
    const stripped = urlValue.split('#')[0].split('?')[0].trim();
    try {
        return decodeURI(stripped);
    } catch {
        return stripped;
    }
}

function normalizeSourceAssetReference(rawValue) {
    return normalizeAssetUrl(rawValue).replace(/^['"]|['"]$/g, '');
}

function resolveAssetPath(htmlFile, assetUrl) {
    if (assetUrl.startsWith('/')) {
        return resolve(DOCS_DIR, `.${assetUrl}`);
    }
    return resolve(dirname(htmlFile), assetUrl);
}

function resolveSourceAssetPath(sourceFile, assetUrl) {
    if (assetUrl.startsWith('/')) {
        return resolve(SRC_DIR, `.${assetUrl}`);
    }
    return resolve(dirname(sourceFile), assetUrl);
}

function extractDocsLocalImageUrls(html) {
    const candidates = [];
    const imgSrcMatches = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
    const imgSrcsetMatches = [...html.matchAll(/<img\b[^>]*\bsrcset=["']([^"']+)["'][^>]*>/gi)];
    const sourceSrcsetMatches = [...html.matchAll(/<source\b[^>]*\bsrcset=["']([^"']+)["'][^>]*>/gi)];
    const metaImageMatches = [...html.matchAll(/<meta\b[^>]*\b(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi)];

    for (const match of imgSrcMatches) candidates.push(match[1]);
    for (const match of imgSrcsetMatches) candidates.push(...splitSrcsetValues(match[1]));
    for (const match of sourceSrcsetMatches) candidates.push(...splitSrcsetValues(match[1]));
    for (const match of metaImageMatches) candidates.push(match[1]);

    return candidates.map((rawValue) => normalizeAssetUrl(rawValue)).filter((assetUrl) => isLocalAssetUrl(assetUrl));
}

function extractDocsLocalAssetUrls(html) {
    const candidates = [];
    const imgSrcMatches = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
    const imgSrcsetMatches = [...html.matchAll(/<img\b[^>]*\bsrcset=["']([^"']+)["'][^>]*>/gi)];
    const sourceSrcMatches = [...html.matchAll(/<source\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
    const sourceSrcsetMatches = [...html.matchAll(/<source\b[^>]*\bsrcset=["']([^"']+)["'][^>]*>/gi)];
    const videoSrcMatches = [...html.matchAll(/<video\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
    const videoPosterMatches = [...html.matchAll(/<video\b[^>]*\bposter=["']([^"']+)["'][^>]*>/gi)];
    const scriptSrcMatches = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
    const linkHrefMatches = [...html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)];
    const metaAssetMatches = [...html.matchAll(/<meta\b[^>]*\b(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi)];

    for (const match of imgSrcMatches) candidates.push(match[1]);
    for (const match of imgSrcsetMatches) candidates.push(...splitSrcsetValues(match[1]));
    for (const match of sourceSrcMatches) candidates.push(match[1]);
    for (const match of sourceSrcsetMatches) candidates.push(...splitSrcsetValues(match[1]));
    for (const match of videoSrcMatches) candidates.push(match[1]);
    for (const match of videoPosterMatches) candidates.push(match[1]);
    for (const match of scriptSrcMatches) candidates.push(match[1]);
    for (const match of linkHrefMatches) candidates.push(match[1]);
    for (const match of metaAssetMatches) candidates.push(match[1]);

    return candidates.map((rawValue) => normalizeAssetUrl(rawValue)).filter((assetUrl) => isLocalAssetUrl(assetUrl));
}

function extractOpenGraphImageValues(content) {
    const matches = content.matchAll(/^\s*openGraphImage\s*:\s*["']?([^"'\n]+)["']?\s*$/gim);
    return [...matches].map((match) => match[1].trim()).filter(Boolean);
}

function extractDynamicSourceImageReferences(content, sourceFile) {
    const refs = [];
    const labyrinthFilenameMatches = content.matchAll(/\bsrc\s*:\s*["']([^"']+?\.(?:png|jpg|jpeg|gif|svg))["']/gi);
    const hasLabyrinthJoinPattern = /["']\.\/img\/["']\s*\+\s*imgs\[[^\]]+\]\.src/.test(content);

    if (sourceFile.endsWith(join('_data', 'labyrinth.json'))) {
        const labyrinthItems = JSON.parse(content);
        for (const item of labyrinthItems) {
            if (!item || typeof item.src !== 'string') continue;
            refs.push(resolve(SRC_DIR, 'labyrinth', 'img', item.src));
        }
    }

    if (hasLabyrinthJoinPattern) {
        for (const match of labyrinthFilenameMatches) {
            refs.push(resolve(dirname(sourceFile), '../labyrinth/img', match[1]));
        }
    }

    return refs;
}

function extractSourceImageReferences(content) {
    const refs = [];
    const quotedPathMatches = content.matchAll(
        /["'`](\.{1,2}\/[^"'`]+?\.(?:png|jpg|jpeg|gif|svg)(?:[?#][^"'`]*)?|\/(?!\/)[^"'`]+?\.(?:png|jpg|jpeg|gif|svg)(?:[?#][^"'`]*)?|[A-Za-z0-9_./ -]+?\.(?:png|jpg|jpeg|gif|svg)(?:[?#][^"'`]*)?)["'`]/gi,
    );
    const frontmatterPathMatches = content.matchAll(
        new RegExp(
            `^\\s*(?:openGraphImage|image|img|thumbnail|headerImage|socialImage|icon|logo)\\s*:\\s*["']?([^"'\\n]+?\\.(?:${[...SOURCE_IMAGE_EXTENSIONS].join('|')})(?:[?#][^"'\\s]+)?)["']?\\s*$`,
            'gim',
        ),
    );
    const markdownImageMatches = content.matchAll(/!\[[^\]]*\]\(([^)\n]+?\.(?:png|jpg|jpeg|gif|svg)(?:[?#][^)\n]+)?)\)/gi);
    const unquotedPathMatches = content.matchAll(/(?:^|[\s(=:,])((?:\.{1,2}\/)?[A-Za-z0-9_./ -]+?\.(?:png|jpg|jpeg|gif|svg)(?:[?#][^\s)"']+)?)(?=$|[\s),])/gim);

    for (const match of quotedPathMatches) refs.push(match[1]);
    for (const match of frontmatterPathMatches) refs.push(match[1]);
    for (const match of markdownImageMatches) refs.push(match[1]);
    for (const match of unquotedPathMatches) refs.push(match[1]);

    return refs;
}

module.exports = {
    SITE_ORIGIN,
    LOCAL_ORIGIN,
    DOCS_DIR,
    SRC_DIR,
    SITEMAP_PATH,
    discoverRoutes,
    snapshotNameForRoute,
    getFilesRecursively,
    listHtmlFilesRecursively,
    listSourceImageFilesRecursively,
    listSourceReferenceFilesRecursively,
    isLocalAssetUrl,
    normalizeAssetUrl,
    normalizeSourceAssetReference,
    resolveAssetPath,
    resolveSourceAssetPath,
    extractDocsLocalImageUrls,
    extractDocsLocalAssetUrls,
    extractOpenGraphImageValues,
    extractDynamicSourceImageReferences,
    extractSourceImageReferences,
};
