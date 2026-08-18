const { test, expect } = require("@playwright/test");
const { readFileSync, existsSync } = require("node:fs");
const { resolve, relative } = require("node:path");
const { execSync } = require("node:child_process");

const {
    DOCS_DIR,
    SRC_DIR,
    getFilesRecursively
} = require("../test_utils");

const CACHE_PATH = resolve(process.cwd(), ".cache", "optimize-media.json");

test("optimize cache exists and has correct structure", () => {
    expect(existsSync(CACHE_PATH), ".cache/optimize-media.json should exist").toBe(true);

    const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8"));
    expect(cache.version).toBe(2);
    expect(typeof cache.images).toBe("object");
    expect(typeof cache.videos).toBe("object");
    expect(Object.keys(cache.images).length).toBeGreaterThan(0);
    expect(Object.keys(cache.videos).length).toBeGreaterThan(0);

    for (const entry of Object.values(cache.images)) {
        expect(typeof entry.sourceFingerprint).toBe("string");
        expect(entry.sourceFingerprint.length).toBeGreaterThan(0);
        expect(entry.output).toBeDefined();
        expect(entry.output.avif).toBeDefined();
        expect(entry.output.webp).toBeDefined();
    }

    for (const entry of Object.values(cache.videos)) {
        expect(typeof entry.sourceFingerprint).toBe("string");
        expect(entry.sourceFingerprint.length).toBeGreaterThan(0);
        expect(typeof entry.encoderSignature).toBe("string");
        expect(typeof entry.hevcEncoderSignature).toBe("string");
        expect(entry.faststartApplied).toBe(true);
        expect(entry.output).toBeDefined();
        expect(entry.output.webm).toBeDefined();
        expect(entry.output.hevc).toBeDefined();
    }
});

test("optimize skips everything on cached run", () => {
    const output = execSync("node scripts/optimize.js", {
        cwd: process.cwd(),
        encoding: "utf8",
        timeout: 120000,
    });

    const imageLine = output.match(/optimize:image completed (.+)/);
    const videoLine = output.match(/optimize:video completed (.+)/);

    expect(imageLine, "Should log image summary").toBeTruthy();
    expect(videoLine, "Should log video summary").toBeTruthy();

    const imageStats = imageLine[1];
    const videoStats = videoLine[1];

    expect(imageStats).toContain("optimized=0");
    expect(imageStats).toContain("failed=0");

    expect(videoStats).toContain("optimized=0");
    expect(videoStats).toContain("failed=0");
});

test("every source mp4 in src has corresponding hevc.mp4 and webm in docs", () => {
    const srcVideos = getFilesRecursively(SRC_DIR, (f) => f.endsWith(".mp4"));
    expect(srcVideos.length).toBeGreaterThan(0);

    const missing = [];

    for (const srcFile of srcVideos) {
        const rel = relative(SRC_DIR, srcFile).replace(/\\/g, "/");
        const docsBase = resolve(DOCS_DIR, rel.replace(/\.mp4$/, ""));

        const hevcPath = docsBase + ".hevc.mp4";
        const webmPath = docsBase + ".webm";

        if (!existsSync(hevcPath)) {
            missing.push(`${rel} -> missing .hevc.mp4`);
        }
        if (!existsSync(webmPath)) {
            missing.push(`${rel} -> missing .webm`);
        }
    }

    expect(missing, `Missing optimized video outputs:\n${missing.join("\n")}`).toEqual([]);
});

test("no stacked extension files in docs", () => {
    const allVideos = getFilesRecursively(DOCS_DIR, (f) => f.endsWith(".mp4") || f.endsWith(".webm"));
    const stacked = allVideos.filter((f) => {
        const name = f.replace(DOCS_DIR + "/", "");
        return name.includes(".hevc.hevc") || name.includes(".hevc.webm");
    });

    expect(stacked, `Found stacked extension files:\n${stacked.join("\n")}`).toEqual([]);
});

test("no video sources produce avif or webp artifacts in docs", () => {
    const srcVideos = getFilesRecursively(SRC_DIR, (f) => f.endsWith(".mp4"));
    expect(srcVideos.length).toBeGreaterThan(0);

    const stale = [];

    for (const srcFile of srcVideos) {
        const rel = relative(SRC_DIR, srcFile).replace(/\\/g, "/");
        const docsBase = resolve(DOCS_DIR, rel.replace(/\.mp4$/, ""));

        if (existsSync(docsBase + ".avif")) {
            stale.push(docsBase + ".avif");
        }
        if (existsSync(docsBase + ".webp")) {
            stale.push(docsBase + ".webp");
        }
    }

    expect(stale, `Found stale image artifacts for video sources:\n${stale.join("\n")}`).toEqual([]);
});

test("no image files in src have avif or webp variants", () => {
    const optimized = getFilesRecursively(SRC_DIR, (f) => f.endsWith(".avif") || f.endsWith(".webp"));
    expect(optimized, `Found optimized images in src/:\n${optimized.join("\n")}`).toEqual([]);
});