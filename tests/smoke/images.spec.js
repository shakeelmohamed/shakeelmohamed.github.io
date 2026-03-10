const { test, expect } = require('@playwright/test');
const { readdirSync, readFileSync, existsSync } = require('node:fs');
const { resolve, dirname, join } = require('node:path');

const DOCS_DIR = resolve(process.cwd(), 'docs');

function listHtmlFilesRecursively(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listHtmlFilesRecursively(fullPath));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function isLocalAssetUrl(value) {
  if (!value) {
    return false;
  }

  return !(
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('//') ||
    value.startsWith('data:') ||
    value.startsWith('#')
  );
}

function splitSrcsetValues(srcset) {
  return srcset
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function normalizeAssetUrl(urlValue) {
  const stripped = urlValue.split('#')[0].split('?')[0].trim();

  try {
    return decodeURI(stripped);
  } catch {
    return stripped;
  }
}

function resolveAssetPath(htmlFile, assetUrl) {
  if (assetUrl.startsWith('/')) {
    return resolve(DOCS_DIR, `.${assetUrl}`);
  }

  return resolve(dirname(htmlFile), assetUrl);
}

test('all linked local images exist in repo', async () => {
  const htmlFiles = listHtmlFilesRecursively(DOCS_DIR);
  expect(htmlFiles.length, 'No generated HTML files found under docs').toBeGreaterThan(0);

  const missing = [];

  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8');

    const imgSrcMatches = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
    const sourceSrcsetMatches = [...html.matchAll(/<source\b[^>]*\bsrcset=["']([^"']+)["'][^>]*>/gi)];
    const metaImageMatches = [
      ...html.matchAll(/<meta\b[^>]*\b(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi),
    ];

    const candidates = [];

    for (const match of imgSrcMatches) {
      candidates.push(match[1]);
    }

    for (const match of sourceSrcsetMatches) {
      candidates.push(...splitSrcsetValues(match[1]));
    }

    for (const match of metaImageMatches) {
      candidates.push(match[1]);
    }

    for (const rawValue of candidates) {
      const assetUrl = normalizeAssetUrl(rawValue);
      if (!isLocalAssetUrl(assetUrl)) {
        continue;
      }

      const filePath = resolveAssetPath(htmlFile, assetUrl);
      if (!existsSync(filePath)) {
        missing.push(`${htmlFile} -> ${assetUrl}`);
      }
    }
  }

  expect(missing, `Missing image assets:\n${missing.join('\n')}`).toEqual([]);
});
