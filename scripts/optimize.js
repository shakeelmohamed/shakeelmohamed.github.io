const Image = require('@11ty/eleventy-img');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = process.cwd();
const DOCS_ROOT = path.resolve(ROOT, 'docs');
const CACHE_PATH = path.resolve(ROOT, '.cache/optimize-media.json');
const TARGET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const VIDEO_EXTENSIONS = new Set(['.mp4']);
const VIDEO_ENCODER_SIGNATURE = 'vp9-crf33-b0-rowmt1-opus-v1';

async function main() {
    const allFiles = collectFiles(DOCS_ROOT);
    const imageFiles = allFiles.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return TARGET_EXTENSIONS.has(ext);
    });
    const videoFiles = allFiles.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return VIDEO_EXTENSIONS.has(ext);
    });

    const cache = readCache(CACHE_PATH);
    const imageResult = await optimizeImages(imageFiles, cache.images);
    const videoResult = await optimizeVideos(videoFiles, cache.videos);

    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(
        CACHE_PATH,
        `${JSON.stringify(
            {
                version: 2,
                images: imageResult.cache,
                videos: videoResult.cache,
            },
            null,
            2,
        )}\n`,
    );

    console.log(
        `optimize:image completed optimized=${imageResult.optimizedCount} skipped=${imageResult.skippedCount} failed=${imageResult.failedCount} total=${imageFiles.length}`,
    );
    console.log(
        `optimize:video completed optimized=${videoResult.optimizedCount} skipped=${videoResult.skippedCount} failed=${videoResult.failedCount} total=${videoFiles.length}`,
    );
}

async function optimizeImages(files, imageCache) {
    const nextCache = {};
    let optimizedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    if (files.length === 0) {
        console.log('optimize:image no qualifying files found');
        return { optimizedCount, skippedCount, failedCount, cache: nextCache };
    }

    for (const file of files) {
        const relative = normalizePath(path.relative(DOCS_ROOT, file));
        const outputDir = path.dirname(file);
        const sourceStats = fs.statSync(file);
        const avifPath = file.replace(/\.(png|jpe?g)$/i, '.avif');
        const webpPath = file.replace(/\.(png|jpe?g)$/i, '.webp');
        const cached = imageCache[relative];

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
            console.log(`optimize:image generated avif/webp for ${relative}`);

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
            console.error(`optimize:image failed for ${relative}: ${error.message}`);
        }
    }

    return { optimizedCount, skippedCount, failedCount, cache: nextCache };
}

async function optimizeVideos(files, videoCache) {
    const nextCache = {};
    let optimizedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    if (files.length === 0) {
        console.log('optimize:video no qualifying files found');
        return { optimizedCount, skippedCount, failedCount, cache: nextCache };
    }

    ensureFfmpegAvailable();

    for (const file of files) {
        const relative = normalizePath(path.relative(DOCS_ROOT, file));
        const sourceStats = fs.statSync(file);
        const sourceFingerprint = await fingerprintFile(file);
        const webmPath = file.replace(/\.mp4$/i, '.webm');
        const webmRelativePath = normalizePath(path.relative(DOCS_ROOT, webmPath));
        const cached = videoCache[relative];

        const outputExists = fs.existsSync(webmPath);
        const outputInSync = outputExists && fs.statSync(webmPath).mtimeMs >= sourceStats.mtimeMs;
        const cacheInSync =
      cached
      && cached.sourceFingerprint === sourceFingerprint
      && cached.encoderSignature === VIDEO_ENCODER_SIGNATURE;

        if (outputExists && cacheInSync && outputInSync) {
            skippedCount += 1;
            nextCache[relative] = {
                sourceFingerprint,
                sourceSize: sourceStats.size,
                sourceMtimeMs: sourceStats.mtimeMs,
                encoderSignature: VIDEO_ENCODER_SIGNATURE,
                optimizedAt: cached && cached.optimizedAt ? cached.optimizedAt : Date.now(),
                output: {
                    webm: webmRelativePath,
                },
            };
            continue;
        }

        try {
            transcodeVideoToWebm(file, webmPath);
            optimizedCount += 1;
            console.log(`optimize:video generated webm for ${relative}`);

            const webmStats = fs.statSync(webmPath);
            nextCache[relative] = {
                sourceFingerprint,
                sourceSize: sourceStats.size,
                sourceMtimeMs: sourceStats.mtimeMs,
                encoderSignature: VIDEO_ENCODER_SIGNATURE,
                optimizedAt: Date.now(),
                output: {
                    webm: webmRelativePath,
                },
                outputSize: webmStats.size,
            };
        } catch (error) {
            failedCount += 1;
            console.error(`optimize:video failed for ${relative}: ${error.message}`);
        }
    }

    return { optimizedCount, skippedCount, failedCount, cache: nextCache };
}

function collectFiles(dir) {
    const result = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            result.push(...collectFiles(fullPath));
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

function ensureFfmpegAvailable() {
    const versionCheck = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    if (versionCheck.status === 0) {
        return;
    }

    throw new Error('ffmpeg CLI is required for MP4 to WebM optimization.');
}

function transcodeVideoToWebm(inputPath, outputPath) {
    const result = spawnSync(
        'ffmpeg',
        [
            '-y',
            '-i',
            inputPath,
            '-c:v',
            'libvpx-vp9',
            '-crf',
            '33',
            '-b:v',
            '0',
            '-row-mt',
            '1',
            '-pix_fmt',
            'yuv420p',
            '-c:a',
            'libopus',
            outputPath,
        ],
        { stdio: 'pipe' },
    );

    if (result.status !== 0) {
        const stderr = (result.stderr || '').toString().trim();
        const detail = stderr.length > 0 ? ` ${stderr}` : '';
        throw new Error(`ffmpeg failed with status ${result.status}.${detail}`);
    }
}

async function fingerprintFile(filePath) {
    const hash = crypto.createHash('sha256');

    await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);

        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('error', reject);
        stream.on('end', resolve);
    });

    return hash.digest('hex');
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

function readCache(filePath) {
    const cache = readJson(filePath);

    if (!cache) {
        return { images: {}, videos: {} };
    }

    if (cache.images || cache.videos) {
        return {
            images: cache.images || {},
            videos: cache.videos || {},
        };
    }

    return {
        images: cache,
        videos: {},
    };
}

main().catch((error) => {
    console.error(`optimize: fatal error: ${error.message}`);
    process.exit(1);
});
