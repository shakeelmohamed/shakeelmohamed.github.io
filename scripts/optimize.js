const Image = require('@11ty/eleventy-img');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const DOCS_ROOT = path.resolve(ROOT, 'docs');
const CACHE_PATH = path.resolve(ROOT, '.cache/optimize-media.json');
const TARGET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

async function main() {
  const files = collectImageFiles(DOCS_ROOT).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return TARGET_EXTENSIONS.has(ext);
  });

  const cache = readJson(CACHE_PATH) || {};
  const nextCache = {};

  if (files.length === 0) {
    console.log('optimize: no qualifying image files found');
    return;
  }

  let optimizedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const file of files) {
    const relative = normalizePath(path.relative(DOCS_ROOT, file));
    const outputDir = path.dirname(file);
    const sourceStats = fs.statSync(file);
    const avifPath = file.replace(/\.(png|jpe?g)$/i, '.avif');
    const webpPath = file.replace(/\.(png|jpe?g)$/i, '.webp');
    const cached = cache[relative];

    const outputsExist = fs.existsSync(avifPath) && fs.existsSync(webpPath);
    const outputsInSync = outputsExist && outputsAreInSync(sourceStats.mtimeMs, avifPath, webpPath);
    const cacheInSync = cached && cached.sourceMtimeMs === sourceStats.mtimeMs;

    if ((cacheInSync && outputsExist) || outputsInSync) {
      skippedCount += 1;
      nextCache[relative] = {
        sourceMtimeMs: sourceStats.mtimeMs,
        optimizedAt: cached && cached.optimizedAt ? cached.optimizedAt : Date.now(),
        output: {
          avif: normalizePath(path.relative(DOCS_ROOT, avifPath)),
          webp: normalizePath(path.relative(DOCS_ROOT, webpPath)),
        },
      };
      continue;
    }

    try {
      const metadata = await Image(file, {
        widths: [null],
        formats: ['avif', 'webp'],
        outputDir,
        filenameFormat(_id, src, _width, format) {
          return `${path.parse(src).name}.${format}`;
        },
        sharpAvifOptions: {
          quality: 50,
        },
        sharpWebpOptions: {
          quality: 80,
        },
      });

      optimizedCount += 1;
      console.log(`optimize: generated avif/webp for ${relative}`);

      const firstAvif = metadata.avif && metadata.avif[0];
      const firstWebp = metadata.webp && metadata.webp[0];
      nextCache[relative] = {
        sourceMtimeMs: sourceStats.mtimeMs,
        optimizedAt: Date.now(),
        output: {
          avif: firstAvif
            ? normalizePath(path.relative(DOCS_ROOT, firstAvif.outputPath))
            : normalizePath(path.relative(DOCS_ROOT, avifPath)),
          webp: firstWebp
            ? normalizePath(path.relative(DOCS_ROOT, firstWebp.outputPath))
            : normalizePath(path.relative(DOCS_ROOT, webpPath)),
        },
      };
    } catch (error) {
      failedCount += 1;
      console.error(`optimize: failed for ${relative}: ${error.message}`);
    }
  }

  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, `${JSON.stringify(nextCache, null, 2)}\n`);

  console.log(
    `optimize: completed optimized=${optimizedCount} skipped=${skippedCount} failed=${failedCount} total=${files.length}`,
  );
}

function collectImageFiles(dir) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(...collectImageFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      result.push(fullPath);
    }
  }

  return result;
}

function normalizePath(value) {
  return value.split('\\').join('/');
}

function outputsAreInSync(sourceMtimeMs, avifPath, webpPath) {
  const avifStats = fs.statSync(avifPath);
  const webpStats = fs.statSync(webpPath);

  return avifStats.mtimeMs >= sourceMtimeMs && webpStats.mtimeMs >= sourceMtimeMs;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

main().catch((error) => {
  console.error(`optimize: fatal error: ${error.message}`);
  process.exit(1);
});
