const path = require('path');
const utils = require('../utils');

module.exports = {
    eleventyComputed: {
        sitemapEntries: async function(data) {
            const excludedUrls = new Set([
                '/projects/salgirah-festival-identity/',
                '/404/'
            ]);

            const pages = data.collections.sitemap.filter(entry => !excludedUrls.has(entry.url));

            return Promise.all(
                pages.map(async (entry) => {
                    let lastmod = null;

                    try {
                        if (entry.inputPath) {
                            const relativeInputPath = './' + path.relative(process.cwd(), entry.inputPath);
                            const dates = await utils.gitDates(relativeInputPath);
                            if (dates && dates.modified) {
                                lastmod = utils.formatDate(dates.modified);
                            }
                        }
                    }
                    catch (_err) {
                        // Fall back below when git metadata is unavailable.
                    }

                    if (!lastmod && entry.date) {
                        lastmod = utils.formatDate(entry.date);
                    }

                    return {
                        loc: data.metadata.baseurl + entry.url,
                        lastmod
                    };
                })
            );
        }
    }
};
