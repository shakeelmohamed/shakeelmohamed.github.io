const { test, expect } = require('@playwright/test');
const { readdirSync, statSync, readFileSync } = require('node:fs');
const { resolve, extname, join } = require('node:path');

const DATA_DIR = resolve(process.cwd(), 'src/_data');

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

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertStringField(record, fieldName, fileName, index) {
  expect(
    typeof record[fieldName] === 'string' && record[fieldName].trim().length > 0,
    `${fileName} entry ${index} must include non-empty string "${fieldName}"`,
  ).toBe(true);
}

function validateLinksJson(data, fileName) {
  expect(Array.isArray(data), `${fileName} must export an array`).toBe(true);

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    expect(isPlainObject(entry), `${fileName} entry ${i} must be an object`).toBe(true);

    const keys = Object.keys(entry).sort();
    expect(keys, `${fileName} entry ${i} must only contain text + url`).toEqual(['text', 'url']);

    assertStringField(entry, 'text', fileName, i);
    assertStringField(entry, 'url', fileName, i);
  }
}

function validateMetadataJson(data, fileName) {
  expect(isPlainObject(data), `${fileName} must export an object`).toBe(true);
  assertStringField(data, 'baseurl', fileName, 'root');

  expect(isPlainObject(data.author), `${fileName}.author must be an object`).toBe(true);
  assertStringField(data.author, 'name', fileName, 'author');
  assertStringField(data.author, 'email', fileName, 'author');

  expect(isPlainObject(data.social), `${fileName}.social must be an object`).toBe(true);
  for (const [key, value] of Object.entries(data.social)) {
    expect(typeof value === 'string' && value.trim().length > 0, `${fileName}.social.${key} must be a string`).toBe(true);
  }
}

function validateLabyrinthJson(data, fileName) {
  expect(Array.isArray(data), `${fileName} must export an array`).toBe(true);

  for (let i = 0; i < data.length; i++) {
    const img = data[i];
    expect(isPlainObject(img), `${fileName}[${i}] must be an object`).toBe(true);

    const keys = Object.keys(img).sort();
    expect(keys, `${fileName}[${i}] must only contain pos + src`).toEqual(['pos', 'src']);

    assertStringField(img, 'src', fileName, i);
    expect(isPlainObject(img.pos), `${fileName}[${i}].pos must be an object`).toBe(true);

    const posKeys = Object.keys(img.pos).sort();
    expect(posKeys, `${fileName}[${i}].pos must only contain width + x + y + z`).toEqual(['width', 'x', 'y', 'z']);

    for (const fieldName of ['x', 'y', 'z', 'width']) {
      const value = img.pos[fieldName];
      expect(
        typeof value === 'number' && Number.isFinite(value),
        `${fileName}[${i}].pos.${fieldName} must be a finite number`,
      ).toBe(true);
    }

    expect(img.pos.width > 0 && img.pos.width <= 100, `${fileName}[${i}].pos.width must be in (0, 100]`).toBe(true);
  }
}

function validateMentionsJs(data, fileName) {
  expect(isPlainObject(data), `${fileName} must export an object`).toBe(true);
  expect(Array.isArray(data.all), `${fileName}.all must be an array`).toBe(true);
  expect(Array.isArray(data.recent), `${fileName}.recent must be an array`).toBe(true);

  for (let i = 0; i < data.all.length; i++) {
    const mention = data.all[i];
    expect(isPlainObject(mention), `${fileName}.all[${i}] must be an object`).toBe(true);

    const keys = Object.keys(mention).sort();
    expect(keys, `${fileName}.all[${i}] must only contain date + title + url`).toEqual([
      'date',
      'title',
      'url',
    ]);

    assertStringField(mention, 'date', `${fileName}.all`, i);
    assertStringField(mention, 'title', `${fileName}.all`, i);
    assertStringField(mention, 'url', `${fileName}.all`, i);
  }
}

function validateEleventyComputedJs(data, fileName) {
  expect(isPlainObject(data), `${fileName} must export an object`).toBe(true);
  expect(isPlainObject(data.eleventyComputed), `${fileName}.eleventyComputed must be an object`).toBe(true);
  expect(typeof data.eleventyComputed.cleanDate, `${fileName}.eleventyComputed.cleanDate must be a function`).toBe('function');
  expect(
    typeof data.eleventyComputed.atomFeedUpdatedDate,
    `${fileName}.eleventyComputed.atomFeedUpdatedDate must be a function`,
  ).toBe('function');
}

const validators = {
  'links.json': validateLinksJson,
  'metadata.json': validateMetadataJson,
  'labyrinth.json': validateLabyrinthJson,
  'mentions.js': validateMentionsJs,
  'eleventyComputed.js': validateEleventyComputedJs,
};

test('all src/_data files match schema', async () => {
  const files = readdirSync(DATA_DIR).filter((name) => {
    const fullPath = resolve(DATA_DIR, name);
    return statSync(fullPath).isFile() && ['.js', '.json'].includes(extname(name));
  });

  for (const fileName of files) {
    const validator = validators[fileName];
    expect(typeof validator, `Missing schema validator for ${fileName}`).toBe('function');

    const filePath = resolve(DATA_DIR, fileName);
    // Clear cache so this stays deterministic during watch/iterative runs.
    delete require.cache[filePath];
    const value = require(filePath);

    validator(value, fileName);
  }
});

function validateMediaTypesPages() {
  const PROJECTS_DIR = resolve(process.cwd(), 'src', 'projects');
  const DOCS_DIR = resolve(process.cwd(), 'docs');
  const mediaTypeCounts = new Map();

  const projectFiles = getFilesRecursively(PROJECTS_DIR, (f) => f.endsWith('index.pug'));

  for (const file of projectFiles) {
    const content = readFileSync(file, 'utf8');

    if (/^\s*-\s*archive\s*$/m.test(content)) continue;

    const mediaMatch = content.match(/^media:\s*\n((?:\s*-\s*.+\n?)+)/m);
    if (mediaMatch) {
      const types = mediaMatch[1].match(/(?<=\s*-\s*).+/g) || [];
      const uniqueTypes = [...new Set(types.map((t) => t.trim()))];

      for (const mediaType of uniqueTypes) {
        mediaTypeCounts.set(mediaType, (mediaTypeCounts.get(mediaType) || 0) + 1);
      }
    }
  }

  expect(mediaTypeCounts.size, 'Should discover at least one media type').toBeGreaterThan(0);

  for (const [mediaType, expectedCount] of mediaTypeCounts) {
    const slug = mediaType.replace(/\s+/g, '-').toLowerCase();
    const pagePath = resolve(DOCS_DIR, slug, 'index.html');

    expect(statSync(pagePath).isFile(), `Media type "${mediaType}" should generate /${slug}/`).toBe(true);

    const html = readFileSync(pagePath, 'utf8');
    const projectLinks = html.match(/<div class="block-project-listing"><a href="\/projects\/[^"]+"/g) || [];
    const uniqueProjectUrls = new Set(
      projectLinks
        .map(m => m.match(/href="([^"]+)"/)[1])
        .map(url => url.endsWith('/') ? url : url + '/')
    );
    const actualCount = uniqueProjectUrls.size;

    expect(actualCount, `/${slug}/ should have ${expectedCount} projects, found ${actualCount}`).toBe(expectedCount);
  }
}

test('mediaTypes collection generates correct pages with correct project counts', async () => {
  validateMediaTypesPages();
});