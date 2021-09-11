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
        debug: false,
        pretty: "    "
    });

    // Template aliases
    eleventyConfig.addLayoutAlias('base', 'layouts/base.pug');
    eleventyConfig.addLayoutAlias('post', 'layouts/post.pug');
    eleventyConfig.addLayoutAlias('project', 'layouts/project.pug');

    // Omit featured posts, sort remaining in reverse order
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByTag("post").reverse().filter(post => {
            return !post.data.tags.includes("featured");
        });
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

    // TODO: Include speedlify score somewhere, maybe on the design system page
    // https://github.com/zachleat/speedlify-score

    // TODO: integrate alex for biased & bad word checks https://github.com/get-alex/alex
};