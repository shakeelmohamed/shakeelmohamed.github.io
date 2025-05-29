module.exports = function(eleventyConfig) {
    // File extensions to passthrough copy
    eleventyConfig.setTemplateFormats([
        "pug",
        "md",

        "png",
        "jpg",
        "svg",
        "ico",
        "mp4",
        "avif",
        "gif",
        "pdf",

        "webmanifest",
        "xml",
        "txt",

        "woff2"
    ]);
    eleventyConfig.addPassthroughCopy("src/scripts");
    eleventyConfig.addPassthroughCopy("src/CNAME");

    // TODO: switch to the new 11ty server: https://www.11ty.dev/docs/dev-server/
    eleventyConfig.addWatchTarget("**.pug");
    eleventyConfig.addWatchTarget("src/**");
    eleventyConfig.addWatchTarget("src/_includes/**");
    eleventyConfig.addWatchTarget("src/styles.css");
    eleventyConfig.setWatchThrottleWaitTime(100);
    
    // Custom markdown processor
    let markdownIt = require("markdown-it");
    let options = {
        html: true,
        linkify: true,
        typographer: true,
        breaks: true
    };
    let markdownLib = markdownIt(options);
    eleventyConfig.setLibrary("md", markdownLib);

    // Pug specific options 
    eleventyConfig.setPugOptions({
        debug: false,
        pretty: "    "
    });

    // Template aliases
    eleventyConfig.addLayoutAlias('base', 'layouts/base.pug');
    eleventyConfig.addLayoutAlias('post', 'layouts/post.pug');
    eleventyConfig.addLayoutAlias('project', 'layouts/project.pug');

    // TODO: currently hiding the BREAK microsite
    eleventyConfig.ignores.add("src/break");
    // eleventyConfig.addPassthroughCopy("src/break/styles.css");

    // Sort all pages for sitemap
    eleventyConfig.addCollection("sitemap", function(collectionApi) {
        return collectionApi.getAll().sort((a, b) => {
            if (a.url < b.url) {
                return -1;
            } else if (a.url > b.url) {
                return 1;
            } else {
                return 0;
            }
        });
    });


    // Reverse sort posts, only show this and last year's posts
    eleventyConfig.addCollection("recentPosts", function(collectionApi) {
        return collectionApi.getFilteredByTag("post").reverse().filter(post => {
            const lastYear = (new Date()).getFullYear() - 1;
            return post.data.date.getFullYear() >= lastYear;
        });
    });

    // Reverse sort posts
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByTag("post").reverse();
    });

    // Reverse sort featured posts
    eleventyConfig.addCollection("featured", function(collectionApi) {
        return collectionApi.getFilteredByTag("featured").reverse();
    });

    // Omit archived projects, sort remaining in reverse order
    eleventyConfig.addCollection("project", function(collectionApi) {
        return collectionApi.getFilteredByTag("project").reverse().filter(post => {
            return !post.data.tags.includes("archive");
        });
    });

    // For "featured portfolio" projects, allow manual positioning
    eleventyConfig.addCollection("portfolio", function(collectionApi) {
        // TODO: will need some filtering here I think
        return collectionApi.getFilteredByTag("portfolio").sort((a, b) => {
            return a.data.position - b.data.position;
        });
    });

    // TODO: media “tags”, basically want to create a collection per data.media value

    /**
     * tags for design projects:
     *     - portfolio - shown on homepage [done]
     *     - project - this is a design project [I think done]
     *     - archive - TODO: do not show this project except by permalink?
     */

    // TODO: Include speedlify score somewhere, maybe on the design system page
    // https://github.com/zachleat/speedlify-score
    // 
    
    /* TODO: available hack for using pug filters
    see https://github.com/11ty/eleventy/issues/1523
    
    global.filters = eleventyConfig.javascriptFunctions; // magic happens here
    eleventyConfig.setPugOptions({ // and here
        globals: ['filters']
    });
     */
};