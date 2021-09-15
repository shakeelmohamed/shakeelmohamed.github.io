module.exports = function(eleventyConfig) {
    // File extensions to passthrough copy
    eleventyConfig.setTemplateFormats([
        "pug",
        "png",
        "jpg",
        "md",
        "svg",
        "ico",
        "webmanifest"
      ]);
    
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
        return collectionApi.getFilteredByTag("portfolio").sort((a, b) => {
            return a.data.position - b.data.position;
        });
    });

    // TODO: Include speedlify score somewhere, maybe on the design system page
    // https://github.com/zachleat/speedlify-score
};