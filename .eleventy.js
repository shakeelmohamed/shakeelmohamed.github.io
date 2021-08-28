const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");

module.exports = function(eleventyConfig) {
    // File extensions to passthrough copy
    eleventyConfig.setTemplateFormats([
        "pug",
        "png",
        "jpg",
        "js",
        "css"
      ]);
    // Flags from CLI usage --formats=html,md,png,jpg,pug

    // Inclusive language, TODO: how to use this
    eleventyConfig.addPlugin(inclusiveLangPlugin);
    
    // Custom markdown processor
    let markdownIt = require("markdown-it");
    let options = {
        html: true,
        linkify: true,
        typographer: true
    };
    let markdownLib = markdownIt(options);
    eleventyConfig.setLibrary("md", markdownLib);

    

    // Pug specific options 
    eleventyConfig.setPugOptions({
        debug: true,
        pretty: "    "
    });
};