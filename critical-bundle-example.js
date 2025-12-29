// Add this to your .eleventy.js file for advanced bundling
module.exports = function(eleventyConfig) {
    // Add bundle plugin
    eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-bundle"));

    // Add custom transform to inline critical CSS
    eleventyConfig.addTransform("inline-critical-css", function(content, outputPath) {
        if (!outputPath || !outputPath.endsWith('.html')) {
            return content;
        }

        // Only process in production
        if (process.env.NODE_ENV !== 'production') {
            return content;
        }

        // Check if this page uses critical CSS
        const criticalMatch = content.match(/{%\s*set\s+pageCriticalStyles\s*=\s*\[([^\]]+)\]\s*%}/);
        if (!criticalMatch) {
            return content;
        }

        // Extract critical styles and inline them
        // This is a simplified version - you'd want to implement proper critical CSS extraction
        const criticalCSS = `
            /* Critical CSS for ${outputPath} */
            body { @apply antialiased; }
            header { @apply sticky top-0 bg-white z-50; }
            /* Add more critical styles as needed */
        `;

        // Replace external stylesheet with inline critical + preload
        content = content.replace(
            '<link rel="stylesheet" href="/dist/tailwind.css">',
            `<style>${criticalCSS}</style>
            <link rel="preload" href="/dist/tailwind.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
            <noscript><link rel="stylesheet" href="/dist/tailwind.css"></noscript>`
        );

        return content;
    });

    // ... rest of your config
};