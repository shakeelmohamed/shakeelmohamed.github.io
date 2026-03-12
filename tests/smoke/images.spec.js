const { test, expect } = require('@playwright/test');
const { readdirSync, readFileSync, existsSync } = require('node:fs');
const { resolve, dirname, join, relative, extname } = require('node:path');

const DOCS_DIR = resolve(process.cwd(), 'docs');
const SRC_DIR = resolve(process.cwd(), 'src');
const SOURCE_REFERENCE_FILE_EXTENSIONS = new Set(['.pug', '.js', '.json', '.md', '.txt', '.webmanifest', '.xml', '.yml', '.yaml']);
const UNUSED_SOURCE_IMAGE_ALLOWLIST = new Set([]);
const SOURCE_IMAGE_EXTENSION_PATTERN = '(?:png|jpg|jpeg|gif|svg)';

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

function listSourceImageFilesRecursively(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceImageFilesRecursively(fullPath));
      continue;
    }

    if (entry.isFile() && /\.(png|jpg|jpeg|gif|svg)$/i.test(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function listSourceReferenceFilesRecursively(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceReferenceFilesRecursively(fullPath));
      continue;
    }

    if (entry.isFile() && SOURCE_REFERENCE_FILE_EXTENSIONS.has(extname(fullPath).toLowerCase())) {
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

function extractDynamicSourceImageReferences(content, sourceFile) {
  const refs = [];
  const labyrinthFilenameMatches = content.matchAll(/\bsrc\s*:\s*["']([^"']+?\.(?:png|jpg|jpeg|gif|svg))["']/gi);
  const hasLabyrinthJoinPattern = /["']\.\/img\/["']\s*\+\s*imgs\[[^\]]+\]\.src/.test(content);

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
      `^\\s*(?:openGraphImage|image|img|thumbnail|headerImage|socialImage|icon|logo)\\s*:\\s*["']?([^"'\\n]+?\\.${SOURCE_IMAGE_EXTENSION_PATTERN}(?:[?#][^"'\\s]+)?)["']?\\s*$`,
      'gim',
    ),
  );
  const markdownImageMatches = content.matchAll(
    /!\[[^\]]*\]\(([^)\n]+?\.(?:png|jpg|jpeg|gif|svg)(?:[?#][^)\n]+)?)\)/gi,
  );
  const unquotedPathMatches = content.matchAll(
    /(?:^|[\s(=:,])((?:\.{1,2}\/)?[A-Za-z0-9_./ -]+?\.(?:png|jpg|jpeg|gif|svg)(?:[?#][^\s)"']+)?)(?=$|[\s),])/gim,
  );

  for (const match of quotedPathMatches) {
    refs.push(match[1]);
  }

  for (const match of frontmatterPathMatches) {
    refs.push(match[1]);
  }

  for (const match of markdownImageMatches) {
    refs.push(match[1]);
  }

  for (const match of unquotedPathMatches) {
    refs.push(match[1]);
  }

  return refs;
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
