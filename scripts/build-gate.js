const { createHash } = require('node:crypto');
const {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  existsSync,
  rmSync,
} = require('node:fs');
const { relative, resolve } = require('node:path');

const ROOT = process.cwd();
const CACHE_DIR = resolve(ROOT, '.cache');
const STAMP_PATH = resolve(CACHE_DIR, 'build-fingerprint.json');
const NEXT_PATH = resolve(CACHE_DIR, 'build.next.json');
const SKIP_PATH = resolve(CACHE_DIR, 'build.skip');
const OUTPUT_SENTINEL = resolve(ROOT, 'docs/sitemap.txt');

const INPUT_PATHS = [
  'src',
  '.eleventy.js',
  'postcss.config.js',
  'tailwind.config.js',
  'package.json',
  'utils.js',
];

const mode = process.argv[2];

if (mode === '--check') {
  checkBuildGate();
} else if (mode === '--commit') {
  commitBuildFingerprint();
} else {
  console.error('build-gate: expected --check or --commit');
  process.exit(1);
}

function checkBuildGate() {
  mkdirSync(CACHE_DIR, { recursive: true });

  if (process.env.BUILD_FORCE === '1') {
    clearTransientFiles();
    console.log('build-gate: BUILD_FORCE=1, running full build');
    return;
  }

  const currentHash = computeFingerprint();
  const previous = readJson(STAMP_PATH);
  const hasOutput = existsSync(OUTPUT_SENTINEL);

  if (previous && previous.hash === currentHash && hasOutput) {
    writeFileSync(SKIP_PATH, 'skip\n');
    rmSync(NEXT_PATH, { force: true });
    console.log('build-gate: unchanged inputs, build will be skipped');
    return;
  }

  writeJson(NEXT_PATH, {
    hash: currentHash,
    updatedAt: new Date().toISOString(),
  });
  rmSync(SKIP_PATH, { force: true });

  if (!hasOutput) {
    console.log('build-gate: output missing, running build');
    return;
  }

  if (!previous) {
    console.log('build-gate: no fingerprint found, running build');
    return;
  }

  console.log('build-gate: input changes detected, running build');
}

function commitBuildFingerprint() {
  mkdirSync(CACHE_DIR, { recursive: true });

  const next = readJson(NEXT_PATH);
  const hash = next && next.hash ? next.hash : computeFingerprint();

  writeJson(STAMP_PATH, {
    hash,
    committedAt: new Date().toISOString(),
  });

  clearTransientFiles();
  console.log('build-gate: fingerprint updated');
}

function clearTransientFiles() {
  rmSync(SKIP_PATH, { force: true });
  rmSync(NEXT_PATH, { force: true });
}

function readJson(path) {
  if (!existsSync(path)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function computeFingerprint() {
  const hash = createHash('sha256');
  const files = collectInputFiles();

  for (const filePath of files) {
    const rel = normalizePath(relative(ROOT, filePath));
    hash.update(rel);
    hash.update('\0');
    hash.update(readFileSync(filePath));
    hash.update('\0');
  }

  return hash.digest('hex');
}

function collectInputFiles() {
  const files = [];

  for (const input of INPUT_PATHS) {
    const absolute = resolve(ROOT, input);
    if (!existsSync(absolute)) {
      continue;
    }

    const stat = statSync(absolute);
    if (stat.isDirectory()) {
      files.push(...walkFiles(absolute));
    } else if (stat.isFile()) {
      files.push(absolute);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function walkFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const files = [];

  for (const entry of entries) {
    const absolute = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(absolute));
      continue;
    }

    if (entry.isFile()) {
      files.push(absolute);
    }
  }

  return files;
}

function normalizePath(path) {
  return path.split('\\').join('/');
}
