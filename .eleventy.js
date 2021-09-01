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

    // Omit featured post, sort remaining in reverse order
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByTag("post").reverse().filter(post => {
            return !post.data.tags.includes("featured");
        });
    });

    // TODO: integrate alex for biased & bad word checks https://github.com/get-alex/alex
};