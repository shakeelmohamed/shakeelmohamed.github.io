const { test, expect } = require("@playwright/test");
const {
    snapshotNameForRoute,
    isLocalAssetUrl,
    normalizeAssetUrl,
    normalizeSourceAssetReference,
    resolveAssetPath,
    resolveSourceAssetPath,
} = require("../test_utils");

test.describe("test_utils.js", () => {

    test.describe("snapshotNameForRoute", () => {
        test("returns home--hash.png for root path", () => {
            const result = snapshotNameForRoute("/");
            expect(result).toMatch(/^home--[a-f0-9]{8}\.png$/);
        });

        test("generates consistent hash for same route", () => {
            const result1 = snapshotNameForRoute("/posts/2024-03-15-test");
            const result2 = snapshotNameForRoute("/posts/2024-03-15-test");
            expect(result1).toBe(result2);
        });

        test("generates different hash for different routes", () => {
            const result1 = snapshotNameForRoute("/posts/2024-03-15-test");
            const result2 = snapshotNameForRoute("/posts/2024-03-16-test");
            expect(result1).not.toBe(result2);
        });

        test("returns hash with 8 hex characters", () => {
            const result = snapshotNameForRoute("/about");
            const hashMatch = result.match(/--([a-f0-9]{8})\.png$/);
            expect(hashMatch).not.toBeNull();
            expect(hashMatch[1]).toHaveLength(8);
        });

        test("truncates long names to 80 characters", () => {
            const longPath = "/".repeat(50);
            const result = snapshotNameForRoute(longPath);
            const namePart = result.split("--")[0];
            expect(namePart.length).toBeLessThanOrEqual(80);
        });

        test("converts special characters to hyphens", () => {
            const result = snapshotNameForRoute("/posts/hello-world/test");
            expect(result).not.toContain("?");
            expect(result).not.toContain("&");
        });

        test("handles nested paths", () => {
            const result = snapshotNameForRoute("/projects/my-project/sub-page");
            expect(result).toMatch(/^projects__my-project__sub-page--[a-f0-9]{8}\.png$/);
        });
    });

    test.describe("isLocalAssetUrl", () => {
        test("returns true for relative paths", () => {
            expect(isLocalAssetUrl("/img/test.png")).toBe(true);
            expect(isLocalAssetUrl("img/test.png")).toBe(true);
            expect(isLocalAssetUrl("./img/test.png")).toBe(true);
            expect(isLocalAssetUrl("../img/test.png")).toBe(true);
        });

        test("returns false for absolute URLs", () => {
            expect(isLocalAssetUrl("https://example.com/img.png")).toBe(false);
            expect(isLocalAssetUrl("http://example.com/img.png")).toBe(false);
            expect(isLocalAssetUrl("//cdn.example.com/img.png")).toBe(false);
        });

        test("returns false for data URIs", () => {
            expect(isLocalAssetUrl("data:image/png;base64,abc123")).toBe(false);
            expect(isLocalAssetUrl("data:text/css,.class{}")).toBe(false);
        });

        test("returns false for fragment-only URLs", () => {
            expect(isLocalAssetUrl("#section")).toBe(false);
            expect(isLocalAssetUrl("#")).toBe(false);
        });

        test("returns false for null/undefined/empty", () => {
            expect(isLocalAssetUrl(null)).toBe(false);
            expect(isLocalAssetUrl(undefined)).toBe(false);
            expect(isLocalAssetUrl("")).toBe(false);
        });

        test("returns true for paths starting with slash", () => {
            expect(isLocalAssetUrl("/assets/css/style.css")).toBe(true);
            expect(isLocalAssetUrl("/dist/bundle.js")).toBe(true);
        });

        test("returns true for paths without protocol", () => {
            expect(isLocalAssetUrl("assets/img.png")).toBe(true);
            expect(isLocalAssetUrl("static/file.pdf")).toBe(true);
        });
    });

    test.describe("normalizeAssetUrl", () => {
        test("returns input unchanged if no hash or query", () => {
            expect(normalizeAssetUrl("/img/test.png")).toBe("/img/test.png");
        });

        test("removes query string", () => {
            expect(normalizeAssetUrl("/img/test.png?v=123")).toBe("/img/test.png");
            expect(normalizeAssetUrl("/img/test.png?foo=bar&baz=qux")).toBe("/img/test.png");
        });

        test("removes hash fragment", () => {
            expect(normalizeAssetUrl("/img/test.png#section")).toBe("/img/test.png");
        });

        test("removes both query and hash", () => {
            expect(normalizeAssetUrl("/img/test.png?v=1#section")).toBe("/img/test.png");
        });

        test("handles URLs with special characters", () => {
            expect(normalizeAssetUrl("/img/test%20file.png")).toBe("/img/test file.png");
        });

        test("handles already normalized URL", () => {
            expect(normalizeAssetUrl("/img/test.png")).toBe("/img/test.png");
        });

        test("handles URL with empty query", () => {
            expect(normalizeAssetUrl("/img/test.png?")).toBe("/img/test.png");
        });

        test("handles URL with only hash", () => {
            expect(normalizeAssetUrl("/img/test.png#")).toBe("/img/test.png");
        });
    });

    test.describe("normalizeSourceAssetReference", () => {
        test("removes surrounding single quotes", () => {
            expect(normalizeSourceAssetReference("'img/test.png'")).toBe("img/test.png");
        });

        test("removes surrounding double quotes", () => {
            expect(normalizeSourceAssetReference("\"img/test.png\"")).toBe("img/test.png");
        });

        test("handles unquoted values", () => {
            expect(normalizeSourceAssetReference("img/test.png")).toBe("img/test.png");
        });

        test("handles quoted values with path", () => {
            expect(normalizeSourceAssetReference("'./img/test.png'")).toBe("./img/test.png");
            expect(normalizeSourceAssetReference("\"../assets/style.css\"")).toBe("../assets/style.css");
        });

        test("handles query strings (normalized)", () => {
            expect(normalizeSourceAssetReference("'img/test.png?v=123'")).toBe("img/test.png");
        });

        test("handles mixed quote styles", () => {
            expect(normalizeSourceAssetReference("'img/test.png")).toBe("img/test.png");
        });
    });

    test.describe("resolveAssetPath", () => {
        test("resolves absolute path from docs directory", () => {
            const result = resolveAssetPath("/path/to/file.html", "/img/test.png");
            expect(result).toContain("docs");
            expect(result).toContain("img");
            expect(result).toContain("test.png");
        });

        test("resolves relative path from file directory", () => {
            const result = resolveAssetPath("/path/to/file.html", "img/test.png");
            expect(result).toContain("path");
            expect(result).toContain("to");
            expect(result).toContain("img");
            expect(result).toContain("test.png");
        });

        test("resolves path with parent directory", () => {
            const result = resolveAssetPath("/path/to/file.html", "../img/test.png");
            expect(result).toContain("path");
            expect(result).toContain("img");
        });
    });

    test.describe("resolveSourceAssetPath", () => {
        test("resolves absolute path from source directory", () => {
            const result = resolveSourceAssetPath("/src/posts/test.md", "/img/test.png");
            expect(result).toContain("src");
            expect(result).toContain("img");
            expect(result).toContain("test.png");
        });

        test("resolves relative path from file directory", () => {
            const result = resolveSourceAssetPath("/src/posts/test.md", "img/test.png");
            expect(result).toContain("src");
            expect(result).toContain("posts");
            expect(result).toContain("img");
            expect(result).toContain("test.png");
        });
    });

});
