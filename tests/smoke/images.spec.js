const { test, expect } = require('@playwright/test');
const { existsSync } = require('node:fs');
const { resolve, relative } = require('node:path');

const {
    DOCS_DIR,
    SRC_DIR,
    listHtmlFilesRecursively,
    listSourceImageFilesRecursively,
    listSourceReferenceFilesRecursively,
    extractDocsLocalImageUrls,
    extractDocsLocalAssetUrls,
    extractOpenGraphImageValues,
    extractDynamicSourceImageReferences,
    extractSourceImageReferences,
    resolveAssetPath,
    resolveSourceAssetPath,
    normalizeSourceAssetReference,
    isLocalAssetUrl,
} = require('../test_utils');

const UNUSED_SOURCE_IMAGE_ALLOWLIST = new Set([]);

test('all linked local images exist in repo', async () => {
    const htmlFiles = listHtmlFilesRecursively(DOCS_DIR);
    expect(htmlFiles.length, 'No generated HTML files found under docs').toBeGreaterThan(0);

    const missing = [];

    for (const htmlFile of htmlFiles) {
        const html = require('node:fs').readFileSync(htmlFile, 'utf8');
        for (const assetUrl of extractDocsLocalImageUrls(html)) {
            const filePath = resolveAssetPath(htmlFile, assetUrl);
            if (!existsSync(filePath)) {
                missing.push(`${htmlFile} -> ${assetUrl}`);
            }
        }
    }

    expect(missing, `Missing image assets:\n${missing.join('\n')}`).toEqual([]);
});

test('all source image files in docs map to src', async () => {
    const docsImageFiles = listSourceImageFilesRecursively(DOCS_DIR);
    expect(docsImageFiles.length, 'No image files found under docs').toBeGreaterThan(0);

    const missing = [];

    for (const docsFile of docsImageFiles) {
        const docsRel = relative(DOCS_DIR, docsFile);
        const expectedSrcPath = resolve(SRC_DIR, docsRel);

        if (!existsSync(expectedSrcPath)) {
            const srcRel = relative(SRC_DIR, expectedSrcPath);
            missing.push(`${docsRel} -> ${srcRel}`);
        }
    }

    expect(missing, `Missing docs->src image mappings:\n${missing.join('\n')}`).toEqual([]);
});

test('all source image files are referenced in source files', async () => {
    const { readFileSync } = require('node:fs');
    const sourceImageFiles = listSourceImageFilesRecursively(SRC_DIR);
    expect(sourceImageFiles.length, 'No image files found under src').toBeGreaterThan(0);

    const sourceReferenceFiles = listSourceReferenceFilesRecursively(SRC_DIR);
    expect(sourceReferenceFiles.length, 'No source files found under src').toBeGreaterThan(0);

    const referencedSourceImages = new Set();

    for (const sourceFile of sourceReferenceFiles) {
        const content = readFileSync(sourceFile, 'utf8');
        const rawRefs = extractSourceImageReferences(content);
        const dynamicRefs = extractDynamicSourceImageReferences(content, sourceFile);

        for (const rawRef of rawRefs) {
            const assetRef = normalizeSourceAssetReference(rawRef);
            if (!isLocalAssetUrl(assetRef)) {
                continue;
            }

            referencedSourceImages.add(resolveSourceAssetPath(sourceFile, assetRef));
        }

        for (const resolvedRef of dynamicRefs) {
            referencedSourceImages.add(resolvedRef);
        }
    }

    const unreferenced = sourceImageFiles
        .filter((sourceImagePath) => {
            const sourceRel = relative(SRC_DIR, sourceImagePath).replace(/\\/g, '/');
            return !referencedSourceImages.has(sourceImagePath) && !UNUSED_SOURCE_IMAGE_ALLOWLIST.has(sourceRel);
        })
        .map((sourceImagePath) => relative(SRC_DIR, sourceImagePath).replace(/\\/g, '/'))
        .sort((a, b) => a.localeCompare(b));

    expect(unreferenced, `Unused source images:\n${unreferenced.join('\n')}`).toEqual([]);
});

test('all og:image links in docs are valid and normalized', async () => {
    const { readFileSync } = require('node:fs');
    const htmlFiles = listHtmlFilesRecursively(DOCS_DIR);
    expect(htmlFiles.length, 'No generated HTML files found under docs').toBeGreaterThan(0);

    const invalid = [];

    for (const htmlFile of htmlFiles) {
        const html = readFileSync(htmlFile, 'utf8');
        const ogImageMatches = [...html.matchAll(/<meta\b[^>]*\bproperty=["']og:image["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi)];

        for (const match of ogImageMatches) {
            const rawValue = match[1].trim();
            if (!rawValue) {
                invalid.push(`${htmlFile} -> empty og:image`);
                continue;
            }

            let parsed;
            try {
                parsed = new URL(rawValue);
            } catch {
                invalid.push(`${htmlFile} -> invalid URL: ${rawValue}`);
                continue;
            }

            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                invalid.push(`${htmlFile} -> unsupported protocol (${parsed.protocol}): ${rawValue}`);
                continue;
            }

            const normalizedPathname = decodeURI(parsed.pathname);
            if (normalizedPathname.includes('/./') || normalizedPathname.includes('/../')) {
                invalid.push(`${htmlFile} -> non-normalized og:image path: ${rawValue}`);
                continue;
            }

            const docsPath = resolve(DOCS_DIR, `.${normalizedPathname}`);
            if (!existsSync(docsPath)) {
                invalid.push(`${htmlFile} -> og:image file missing in docs: ${normalizedPathname}`);
            }
        }
    }

    expect(invalid, `Invalid og:image links:\n${invalid.join('\n')}`).toEqual([]);
});

test('openGraphImage frontmatter values use normalized source-relative paths', async () => {
    const { readFileSync } = require('node:fs');
    const sourceReferenceFiles = listSourceReferenceFilesRecursively(SRC_DIR);
    expect(sourceReferenceFiles.length, 'No source files found under src').toBeGreaterThan(0);

    const invalid = [];

    for (const sourceFile of sourceReferenceFiles) {
        const content = readFileSync(sourceFile, 'utf8');
        const openGraphImages = extractOpenGraphImageValues(content);

        for (const openGraphImage of openGraphImages) {
            if (openGraphImage.startsWith('./')) {
                invalid.push(`${relative(SRC_DIR, sourceFile).replace(/\\/g, '/')} -> ${openGraphImage}`);
            }
        }
    }

    expect(invalid, `Non-normalized openGraphImage source paths:\n${invalid.join('\n')}`).toEqual([]);
});

test('all linked local assets in docs exist in repo', async () => {
    const { readFileSync } = require('node:fs');
    const htmlFiles = listHtmlFilesRecursively(DOCS_DIR);
    expect(htmlFiles.length, 'No generated HTML files found under docs').toBeGreaterThan(0);

    const missing = [];

    for (const htmlFile of htmlFiles) {
        const html = readFileSync(htmlFile, 'utf8');

        for (const assetUrl of extractDocsLocalAssetUrls(html)) {
            const filePath = resolveAssetPath(htmlFile, assetUrl);
            if (!existsSync(filePath)) {
                missing.push(`${htmlFile} -> ${assetUrl}`);
            }
        }
    }

    expect(missing, `Missing local docs assets:\n${missing.join('\n')}`).toEqual([]);
});
