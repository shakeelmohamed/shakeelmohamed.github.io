const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");

module.exports = function(eleventyConfig) {
    // File extensions to passthrough copy
    eleventyConfig.setTemplateFormats([
        "pug",
        "png",
        "jpg",
        "md"
      ]);

    // TODO:
    // eleventyConfig.addPassthroughCopy("assets");
    // eleventyConfig.addPassthroughCopy("css");
    
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
        debug: true,
        pretty: "    "
    });

    // Template aliases
    eleventyConfig.addLayoutAlias('post', 'layouts/post.pug');

    // TODO: reverse sort order for blog posts, newest first
    // Use the default sorting algorithm in reverse (descending dir, date, filename)
    // Note that using a template engine’s `reverse` filter might be easier here
    eleventyConfig.addCollection("post", function(collectionApi) {
        // TODO: should featured posts be omitted?
        return collectionApi.getFilteredByTag("post").reverse();
    });

    // TODO: integrate alex for biased & bad word checks https://github.com/get-alex/alex
};