const { test, expect } = require('@playwright/test');
const {
    formatDate,
    formatDateForAtomFeed,
    titleCase,
    buildOGImageURL,
    gitDates,
} = require('../../utils');

test.describe('utils.js', () => {

    test.describe('formatDate', () => {
        test('returns ISO date string without time', () => {
            const date = new Date('2024-03-15T12:30:45.123Z');
            expect(formatDate(date)).toBe('2024-03-15');
        });

        test('handles date at start of day', () => {
            const date = new Date('2024-01-01T00:00:00.000Z');
            expect(formatDate(date)).toBe('2024-01-01');
        });

        test('handles date at end of day', () => {
            const date = new Date('2024-12-31T23:59:59.999Z');
            expect(formatDate(date)).toBe('2024-12-31');
        });

        test('pads single digit month and day', () => {
            const date = new Date('2024-01-05T00:00:00.000Z');
            expect(formatDate(date)).toBe('2024-01-05');
        });
    });

    test.describe('formatDateForAtomFeed', () => {
        test('returns RFC 3339 formatted date', () => {
            const date = new Date('2024-03-15T12:30:45.123Z');
            expect(formatDateForAtomFeed(date)).toBe('2024-03-15T12:30:45Z');
        });

        test('removes milliseconds', () => {
            const date = new Date('2024-03-15T12:30:45.999Z');
            expect(formatDateForAtomFeed(date)).toBe('2024-03-15T12:30:45Z');
        });

        test('handles date with exactly zero milliseconds', () => {
            const date = new Date('2024-03-15T12:30:45.000Z');
            expect(formatDateForAtomFeed(date)).toBe('2024-03-15T12:30:45Z');
        });

        test('always ends with Z', () => {
            const date = new Date('2024-06-20T08:15:30.500Z');
            const result = formatDateForAtomFeed(date);
            expect(result.endsWith('Z')).toBe(true);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        });
    });

    test.describe('titleCase', () => {
        test('capitalizes single word', () => {
            expect(titleCase('hello')).toBe('Hello');
        });

        test('capitalizes all words in multi-word string', () => {
            expect(titleCase('hello world')).toBe('Hello World');
        });

        test('handles three or more words', () => {
            expect(titleCase('the quick brown fox')).toBe('The Quick Brown Fox');
        });

        test('preserves internal capitalization', () => {
            expect(titleCase('hello WORLD hello')).toBe('Hello WORLD Hello');
        });

        test('handles empty string', () => {
            expect(titleCase('')).toBe('');
        });

        test('handles single character', () => {
            expect(titleCase('a')).toBe('A');
        });

        test('handles string with multiple spaces', () => {
            expect(titleCase('hello   world')).toBe('Hello   World');
        });
    });

    test.describe('buildOGImageURL', () => {
        const warnSpy = () => {
            let warning = null;
            const originalWarn = console.warn;
            console.warn = (msg) => { warning = msg; };
            return () => {
                console.warn = originalWarn;
                return warning;
            };
        };

        test('returns default OG image when openGraphImage is missing', () => {
            const data = { title: 'Test Page' };
            const restoreWarn = warnSpy();
            const result = buildOGImageURL(data);
            expect(result).toBe('/img/opengraph-default.png');
            const warning = restoreWarn();
            expect(warning).toContain('Test Page');
        });

        test('returns relative path with filePathStem when openGraphImage is local', () => {
            const data = {
                openGraphImage: '/img/test.png',
                page: { filePathStem: '/posts/2024-03-15-test/index' }
            };
            const restoreWarn = warnSpy();
            const result = buildOGImageURL(data);
            expect(result).toBe('/posts/2024-03-15-test/img/test.png');
            restoreWarn();
        });

        test('returns absolute URL when openGraphImage starts with https:', () => {
            const data = {
                openGraphImage: 'https://example.com/og.png',
                page: { filePathStem: '/posts/test/index' }
            };
            const restoreWarn = warnSpy();
            const result = buildOGImageURL(data);
            expect(result).toBe('https://example.com/og.png');
            restoreWarn();
        });

        test('handles openGraphImage without leading slash (relative)', () => {
            const data = {
                openGraphImage: 'img/test.png',
                page: { filePathStem: '/posts/test/index' }
            };
            const restoreWarn = warnSpy();
            const result = buildOGImageURL(data);
            expect(result).toBe('/posts/test/img/test.png');
            restoreWarn();
        });

        test('handles index page filePathStem', () => {
            const data = {
                openGraphImage: '/img/test.png',
                page: { filePathStem: '/posts/2024-03-15-test/index' }
            };
            const restoreWarn = warnSpy();
            const result = buildOGImageURL(data);
            expect(result).toBe('/posts/2024-03-15-test/img/test.png');
            restoreWarn();
        });

        test('warns about missing title', () => {
            const data = {};
            const restoreWarn = warnSpy();
            buildOGImageURL(data);
            const warning = restoreWarn();
            expect(warning).toContain('missing an OG image');
        });

        test('handles extra slashes in filePathStem and openGraphImage', () => {
            const data = {
                openGraphImage: '//img/test.png',
                page: { filePathStem: '/posts/test/index/' }
            };
            const restoreWarn = warnSpy();
            const result = buildOGImageURL(data);
            expect(result).toBe('/posts/test/img/test.png');
            restoreWarn();
        });
    });

    test.describe('gitDates', () => {
        test('returns Date instances for cache hit with normalized path', async () => {
            const cache = {
                'content/posts/example.md': {
                    modified: '2024-01-10T12:34:56.000Z',
                    created: '2024-01-01T00:00:00.000Z',
                },
            };

            const directPathResult = await gitDates('content/posts/example.md', () => cache);
            const dotSlashPathResult = await gitDates('./content/posts/example.md', () => cache);

            for (const result of [directPathResult, dotSlashPathResult]) {
                expect(result.modified).toBeInstanceOf(Date);
                expect(result.created).toBeInstanceOf(Date);
                expect(result.modified.toISOString()).toBe(
                    cache['content/posts/example.md'].modified
                );
                expect(result.created.toISOString()).toBe(
                    cache['content/posts/example.md'].created
                );
            }
        });

        test('returns nulls for cache miss', async () => {
            const emptyCache = {};
            const result = await gitDates('content/posts/missing.md', () => emptyCache);

            expect(result).toEqual({
                modified: null,
                created: null,
            });
        });

        test('handles missing or invalid cache without throwing', async () => {
            const noCacheReader = () => null;
            const throwingReader = () => {
                throw new Error('cache read failed');
            };

            const resultWithNoCache = await gitDates('content/posts/example.md', noCacheReader);
            const resultWithThrowingReader = await gitDates(
                'content/posts/example.md',
                throwingReader
            );

            for (const result of [resultWithNoCache, resultWithThrowingReader]) {
                expect(result).toEqual({
                    modified: null,
                    created: null,
                });
            }
        });
    });

});
