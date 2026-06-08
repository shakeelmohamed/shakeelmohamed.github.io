const { test, expect } = require("@playwright/test");
const { existsSync, readFileSync } = require("node:fs");
const { resolve, relative } = require("node:path");

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
} = require("../test_utils");

const UNUSED_SOURCE_IMAGE_ALLOWLIST = new Set([]);

test("all linked local images exist in repo", async () => {
    const htmlFiles = listHtmlFilesRecursively(DOCS_DIR);
    expect(htmlFiles.length, "No generated HTML files found under docs").toBeGreaterThan(0);

    const missing = [];

    for (const htmlFile of htmlFiles) {
        const html = require("node:fs").readFileSync(htmlFile, "utf8");
        for (const assetUrl of extractDocsLocalImageUrls(html)) {
            const filePath = resolveAssetPath(htmlFile, assetUrl);
            if (!existsSync(filePath)) {
                missing.push(`${htmlFile} -> ${assetUrl}`);
            }
        }
    }

    expect(missing, `Missing image assets:\n${missing.join("\n")}`).toEqual([]);
});

test("all source image files in docs map to src", async () => {
    const docsImageFiles = listSourceImageFilesRecursively(DOCS_DIR);
    expect(docsImageFiles.length, "No image files found under docs").toBeGreaterThan(0);

    const missing = [];

    for (const docsFile of docsImageFiles) {
        const docsRel = relative(DOCS_DIR, docsFile);
        const expectedSrcPath = resolve(SRC_DIR, docsRel);

        if (!existsSync(expectedSrcPath)) {
            const srcRel = relative(SRC_DIR, expectedSrcPath);
            missing.push(`${docsRel} -> ${srcRel}`);
        }
    }

    expect(missing, `Missing docs->src image mappings:\n${missing.join("\n")}`).toEqual([]);
});

test("all source image files are referenced in source files", async () => {
    const { readFileSync } = require("node:fs");
    const sourceImageFiles = listSourceImageFilesRecursively(SRC_DIR);
    expect(sourceImageFiles.length, "No image files found under src").toBeGreaterThan(0);

    const sourceReferenceFiles = listSourceReferenceFilesRecursively(SRC_DIR);
    expect(sourceReferenceFiles.length, "No source files found under src").toBeGreaterThan(0);

    const referencedSourceImages = new Set();

    for (const sourceFile of sourceReferenceFiles) {
        const content = readFileSync(sourceFile, "utf8");
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
            const sourceRel = relative(SRC_DIR, sourceImagePath).replace(/\\/g, "/");
            return !referencedSourceImages.has(sourceImagePath) && !UNUSED_SOURCE_IMAGE_ALLOWLIST.has(sourceRel);
        })
        .map((sourceImagePath) => relative(SRC_DIR, sourceImagePath).replace(/\\/g, "/"))
        .sort((a, b) => a.localeCompare(b));

    expect(unreferenced, `Unused source images:\n${unreferenced.join("\n")}`).toEqual([]);
});

test("all og:image links in docs are valid and normalized", async () => {
    const { readFileSync } = require("node:fs");
    const htmlFiles = listHtmlFilesRecursively(DOCS_DIR);
    expect(htmlFiles.length, "No generated HTML files found under docs").toBeGreaterThan(0);

    const invalid = [];

    for (const htmlFile of htmlFiles) {
        const html = readFileSync(htmlFile, "utf8");
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

            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
                invalid.push(`${htmlFile} -> unsupported protocol (${parsed.protocol}): ${rawValue}`);
                continue;
            }

            const normalizedPathname = decodeURI(parsed.pathname);
            if (normalizedPathname.includes("/./") || normalizedPathname.includes("/../")) {
                invalid.push(`${htmlFile} -> non-normalized og:image path: ${rawValue}`);
                continue;
            }

            const docsPath = resolve(DOCS_DIR, `.${normalizedPathname}`);
            if (!existsSync(docsPath)) {
                invalid.push(`${htmlFile} -> og:image file missing in docs: ${normalizedPathname}`);
            }
        }
    }

    expect(invalid, `Invalid og:image links:\n${invalid.join("\n")}`).toEqual([]);
});

test("openGraphImage frontmatter values use normalized source-relative paths", async () => {
    const { readFileSync } = require("node:fs");
    const sourceReferenceFiles = listSourceReferenceFilesRecursively(SRC_DIR);
    expect(sourceReferenceFiles.length, "No source files found under src").toBeGreaterThan(0);

    const invalid = [];

    for (const sourceFile of sourceReferenceFiles) {
        const content = readFileSync(sourceFile, "utf8");
        const openGraphImages = extractOpenGraphImageValues(content);

        for (const openGraphImage of openGraphImages) {
            if (openGraphImage.startsWith("./")) {
                invalid.push(`${relative(SRC_DIR, sourceFile).replace(/\\/g, "/")} -> ${openGraphImage}`);
            }
        }
    }

    expect(invalid, `Non-normalized openGraphImage source paths:\n${invalid.join("\n")}`).toEqual([]);
});

test("all linked local assets in docs exist in repo", async () => {
    const { readFileSync } = require("node:fs");
    const htmlFiles = listHtmlFilesRecursively(DOCS_DIR);
    expect(htmlFiles.length, "No generated HTML files found under docs").toBeGreaterThan(0);

    const missing = [];

    for (const htmlFile of htmlFiles) {
        const html = readFileSync(htmlFile, "utf8");

        for (const assetUrl of extractDocsLocalAssetUrls(html)) {
            const filePath = resolveAssetPath(htmlFile, assetUrl);
            if (!existsSync(filePath)) {
                missing.push(`${htmlFile} -> ${assetUrl}`);
            }
        }
    }

    expect(missing, `Missing local docs assets:\n${missing.join("\n")}`).toEqual([]);
});

test("local markdown images render as responsive picture elements with AVIF/WebP", async () => {
    const sourceFiles = listSourceReferenceFilesRecursively(SRC_DIR).filter(f => f.endsWith(".md"));
    const failures = [];

    for (const srcFile of sourceFiles) {
        const srcRel = relative(SRC_DIR, srcFile).replace(/\\/g, "/");
        const htmlRel = srcRel.replace(/\/index\.md$/, "/index.html").replace(/\.md$/, "/index.html");
        const htmlPath = resolve(DOCS_DIR, htmlRel);

        if (!existsSync(htmlPath)) continue;

        const srcContent = readFileSync(srcFile, "utf8");

        // Only extract actual markdown images: ![alt](img.png)
        const mdImageMatches = srcContent.matchAll(/!\[[^\]]*\]\(([^)\n]+)\)/g);
        const mdImages = [...mdImageMatches].map(m => m[1]);

        // Filter to local images only (not http)
        const localMdImages = mdImages.filter(ref => isLocalAssetUrl(ref) && !ref.startsWith("http"));
        if (localMdImages.length === 0) continue;

        const html = readFileSync(htmlPath, "utf8");

        for (const imgRef of localMdImages) {
            // Skip if it's a figure reference (the function extracts some false positives)
            if (imgRef.includes("figure")) continue;

            const imgFileName = imgRef.split("/").pop();
            const pictureMatch = html.match(new RegExp(`<picture[^>]*>[\\s\\S]*?<img[^>]*src="[^"]*${imgFileName}"[^>]*>[\\s\\S]*?</picture>`, "i"));

            if (!pictureMatch) {
                failures.push(`${srcRel}: local image ${imgRef} not wrapped in picture element`);
                continue;
            }

            const pictureContent = pictureMatch[0];
            if (!pictureContent.includes(".avif")) {
                failures.push(`${srcRel}: picture missing AVIF source for ${imgRef}`);
            }
            if (!pictureContent.includes(".webp")) {
                failures.push(`${srcRel}: picture missing WebP source for ${imgRef}`);
            }
        }
    }

    expect(failures, `Local markdown images not properly converted:\n${failures.join("\n")}`).toEqual([]);
});

test("linked local images in markdown render as anchor wrapped picture elements", async () => {
    const sourceFiles = listSourceReferenceFilesRecursively(SRC_DIR).filter(f => f.endsWith(".md"));
    const failures = [];

    for (const srcFile of sourceFiles) {
        const srcRel = relative(SRC_DIR, srcFile).replace(/\\/g, "/");
        const htmlRel = srcRel.replace(/\/index\.md$/, "/index.html").replace(/\.md$/, "/index.html");
        const htmlPath = resolve(DOCS_DIR, htmlRel);

        if (!existsSync(htmlPath)) continue;

        const srcContent = readFileSync(srcFile, "utf8");

        // Check for linked image pattern: [![alt](img)](link)
        const linkedImageMatches = srcContent.matchAll(/!\[[^\]]*\]\(([^)]+\.(?:png|jpg|jpeg))\)\(([^)]+)\)/g);
        const linkedImages = [...linkedImageMatches];

        if (linkedImages.length === 0) continue;

        const html = readFileSync(htmlPath, "utf8");

        for (const match of linkedImages) {
            const imgRef = match[1];
            const linkUrl = match[2];
            const imgFileName = imgRef.split("/").pop();

            // Look for <a href="link"><picture>...</picture></a> pattern
            const linkedPictureMatch = html.match(new RegExp(`<a[^>]*href="${linkUrl}"[^>]*>[\\s\\S]*?<picture[^>]*>[\\s\\S]*?<img[^>]*src="[^"]*${imgFileName}"[^>]*>[\\s\\S]*?</picture>[\\s\\S]*?</a>`, "i"));

            if (!linkedPictureMatch) {
                failures.push(`${srcRel}: linked image ${imgRef} -> ${linkUrl} not in <a><picture> format`);
                continue;
            }

            const pictureContent = linkedPictureMatch[0];
            if (!pictureContent.includes(".avif")) {
                failures.push(`${srcRel}: linked picture missing AVIF for ${imgRef}`);
            }
            if (!pictureContent.includes(".webp")) {
                failures.push(`${srcRel}: linked picture missing WebP for ${imgRef}`);
            }
        }
    }

    expect(failures, `Linked local images not properly converted:\n${failures.join("\n")}`).toEqual([]);
});

test("remote markdown images remain as plain img elements", async () => {
    const sourceFiles = listSourceReferenceFilesRecursively(SRC_DIR).filter(f => f.endsWith(".md"));
    const failures = [];

    for (const srcFile of sourceFiles) {
        const srcRel = relative(SRC_DIR, srcFile).replace(/\\/g, "/");
        const htmlRel = srcRel.replace(/\/index\.md$/, "/index.html").replace(/\.md$/, "/index.html");
        const htmlPath = resolve(DOCS_DIR, htmlRel);

        if (!existsSync(htmlPath)) continue;

        const srcContent = readFileSync(srcFile, "utf8");
        const imageRefs = extractSourceImageReferences(srcContent);

        // Filter to remote images only
        const remoteImages = imageRefs.filter(ref => ref.startsWith("http://") || ref.startsWith("https://"));
        if (remoteImages.length === 0) continue;

        const html = readFileSync(htmlPath, "utf8");

        for (const imgRef of remoteImages) {
            // Remote images should be plain <img>, not wrapped in <picture>
            const imgSrc = imgRef.split("?")[0];
            const imgFileName = imgSrc.split("/").pop();

            // Check if this img is inside a picture element
            const imgMatch = html.match(new RegExp(`<img[^>]*src="[^"]*${imgFileName}"[^>]*>`));
            if (!imgMatch) continue;

            const imgPosition = html.indexOf(imgMatch[0]);
            const pictureBefore = html.lastIndexOf("<picture>", imgPosition);
            const pictureAfter = html.indexOf("</picture>", imgPosition);
            const isWrapped = pictureBefore !== -1 && (pictureAfter === -1 || pictureAfter > imgPosition);

            if (isWrapped) {
                failures.push(`${srcRel}: remote image ${imgRef} incorrectly wrapped in picture element`);
            }
        }
    }

    expect(failures, `Remote markdown images incorrectly converted:\n${failures.join("\n")}`).toEqual([]);
});

test("all video elements have webm, hevc, and mp4 sources", async () => {
    const { readFileSync } = require("node:fs");
    const htmlFiles = listHtmlFilesRecursively(DOCS_DIR);
    expect(htmlFiles.length, "No generated HTML files found under docs").toBeGreaterThan(0);

    const failures = [];

    for (const htmlFile of htmlFiles) {
        const html = readFileSync(htmlFile, "utf8");
        const videoBlocks = [...html.matchAll(/<video\b[^>]*>([\s\S]*?)<\/video>/gi)];

        for (const [, inner] of videoBlocks) {
            const sourceElements = [...inner.matchAll(/<source\b([^>]*)>/gi)].map(m => m[1]);
            const sources = sourceElements.map(attrs => {
                const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/i);
                const typeMatch = attrs.match(/\btype=["']([^"']+)["']/i);
                return { src: srcMatch ? srcMatch[1] : null, type: typeMatch ? typeMatch[1] : null, raw: attrs };
            }).filter(s => s.src);

            const hasWebm = sources.some(s => s.src.endsWith(".webm"));
            const hasHevc = sources.some(s => s.src.endsWith(".hevc.mp4"));
            const hasMp4 = sources.some(s => s.src.endsWith(".mp4") && !s.src.endsWith(".hevc.mp4"));

            if (!hasWebm || !hasHevc || !hasMp4) {
                const missing = [!hasWebm && "webm", !hasHevc && "hevc.mp4", !hasMp4 && "mp4"].filter(Boolean);
                failures.push(`${htmlFile}: video missing sources: ${missing.join(", ")}`);
            }

            for (const { src, type, raw } of sources) {
                if (!src.startsWith("http://") && !src.startsWith("https://")) {
                    const filePath = resolveAssetPath(htmlFile, decodeURIComponent(src));
                    if (!existsSync(filePath)) {
                        failures.push(`${htmlFile}: video source file missing: ${src}`);
                    }
                }
                if (src.endsWith(".hevc.mp4")) {
                    if (type && type.includes("&quot;")) {
                        failures.push(`${htmlFile}: hevc source has escaped quotes in type attribute: ${raw.trim()}`);
                    }
                    if (!type || !type.match(/codecs=["']?hvc1["']?/)) {
                        failures.push(`${htmlFile}: hevc source missing hvc1 codec in type: ${type}`);
                    }
                }
            }
        }
    }

    expect(failures, `Video source issues:\n${failures.join("\n")}`).toEqual([]);
});

test("markdown images preserve alt text", async () => {
    const sourceFiles = listSourceReferenceFilesRecursively(SRC_DIR).filter(f => f.endsWith(".md"));
    const failures = [];

    for (const srcFile of sourceFiles) {
        const srcRel = relative(SRC_DIR, srcFile).replace(/\\/g, "/");
        const htmlRel = srcRel.replace(/\/index\.md$/, "/index.html").replace(/\.md$/, "/index.html");
        const htmlPath = resolve(DOCS_DIR, htmlRel);

        if (!existsSync(htmlPath)) continue;

        const srcContent = readFileSync(srcFile, "utf8");
        const html = readFileSync(htmlPath, "utf8");

        // Extract alt text from markdown: ![alt text](image.png)
        const mdAltMatches = srcContent.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);

        for (const match of mdAltMatches) {
            const mdAlt = match[1];
            const imgRef = match[2];

            expect(typeof mdAlt).toBe("string");

            // Skip remote images
            if (imgRef.startsWith("http://") || imgRef.startsWith("https://")) continue;

            const imgFileName = imgRef.split("/").pop();

            // Find corresponding img in HTML and verify alt
            const imgMatch = html.match(new RegExp(`<img[^>]*src="[^"]*${imgFileName}"[^>]*>`, "i"));
            if (!imgMatch) continue;

            const htmlImg = imgMatch[0];
            const altMatch = htmlImg.match(/alt="([^"]*)"/);

            if (!altMatch) {
                failures.push(`${srcRel}: img missing alt attribute for ${imgFileName}`);
            }
        }
    }

    expect(failures, `Markdown images with missing or incorrect alt text:\n${failures.join("\n")}`).toEqual([]);
});
