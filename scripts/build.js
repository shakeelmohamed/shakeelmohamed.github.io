const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = process.cwd();
const META_PATH = path.resolve(ROOT, '.cache/build-meta.json');
const OUTPUT_SENTINEL = path.resolve(ROOT, 'docs/sitemap.txt');

const INPUT_PATHS = [
  'src',
  '.eleventy.js',
  'postcss.config.js',
  'package.json',
  'utils.js',
];

const newestInput = findNewestMtime(INPUT_PATHS.map((entry) => path.resolve(ROOT, entry)));
const previous = readJson(META_PATH);
const hasOutput = fs.existsSync(OUTPUT_SENTINEL);

if (shouldSkipBuild()) {
  console.log('build: no changes detected, skipping');
} else {
  run('bun', ['run', 'postcss']);
  run('bunx', ['@11ty/eleventy', '--input=src', '--output=docs']);
}

fs.mkdirSync(path.dirname(META_PATH), { recursive: true });
fs.writeFileSync(
  META_PATH,
  `${JSON.stringify({ newestInput, builtAt: new Date().toISOString() }, null, 2)}\n`,
);

function shouldSkipBuild() {
  if (!hasOutput || !previous || typeof previous.newestInput !== 'number') {
    return false;
  }

  return newestInput <= previous.newestInput;
}

function readJson(path) {
  if (!fs.existsSync(path)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function findNewestMtime(paths) {
  let maxMtime = 0;

  for (const absolutePath of paths) {
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const stat = fs.statSync(absolutePath);
    maxMtime = Math.max(maxMtime, stat.mtimeMs);

    if (!stat.isDirectory()) {
      continue;
    }

    const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
    const children = entries.map((entry) => path.join(absolutePath, entry.name));
    maxMtime = Math.max(maxMtime, findNewestMtime(children));
  }

  return maxMtime;
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: ROOT,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
