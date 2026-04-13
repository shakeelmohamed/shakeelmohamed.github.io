const utils = require("./utils");

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
        
        // TODO: once all are replaced, remove these
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
    eleventyConfig.setWatchThrottleWaitTime(200);
    
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

    // Flag to track if we're in a custom linked image
    let skipNextImage = false;

    // Helper to get attribute from token (handles nested in inline)
    function getAttr(tokens, idx, name) {
        let token = tokens[idx];
        
        // If token is inline, look in children for the image
        if (token && token.type === 'inline' && token.children) {
            const imgToken = token.children.find(t => t.type === 'image');
            if (imgToken) {
                // src is in attrs, alt is in first child's content
                if (name === 'alt' && imgToken.children && imgToken.children[0]) {
                    return imgToken.children[0].content;
                }
                if (imgToken.attrs) {
                    const attr = imgToken.attrs.find(a => a[0] === name);
                    return attr ? attr[1] : null;
                }
            }
        }
        
        // For direct image tokens, alt may be in children content
        if (token && name === 'alt' && token.children && token.children[0]) {
            return token.children[0].content;
        }
        
        // Otherwise look directly on token
        if (token && token.attrs) {
            const attr = token.attrs.find(a => a[0] === name);
            return attr ? attr[1] : null;
        }
        
        return null;
    }

    // Helper to build responsive media HTML (reused by both renderers)
    function buildMediaHTML(src, alt) {
        const baseURL = src.slice(0, src.lastIndexOf('.'));
        
        if (src.endsWith('.mp4')) {
            return `<div class="project-content"><video autoplay loop muted playsinline preload="metadata">
                <source src="${baseURL}.webm" type="video/webm">
                <source src="${src}" type="video/mp4">
            </video></div>`;
        }
        
        return `<picture>
            <source srcset="${baseURL}.avif" type="image/avif">
            <source srcset="${baseURL}.webp" type="image/webp">
            <img src="${src}" alt="${alt}">
        </picture>`;
    }

    // Custom renderer for linked images: [![alt](img)](link)
    markdownLib.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        const nextToken = tokens[idx + 1];
        
        if (nextToken && nextToken.type === 'image') {
            const src = getAttr(tokens, idx + 1, 'src');
            const alt = getAttr(tokens, idx + 1, 'alt') || '';
            
            if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
                skipNextImage = true;
                const alt = getAttr(tokens, idx + 1, 'alt') || '';
                // Call default link_open for <a href="...">, then add media
                return self.renderToken(tokens, idx, options) + buildMediaHTML(src, alt);
            }
        }
        
        return self.renderToken(tokens, idx, options);
    };

    // Custom renderer for regular images: ![alt](img)
    markdownLib.renderer.rules.image = function(tokens, idx, options, env, self) {
        if (skipNextImage) {
            skipNextImage = false;
            return '';
        }
        
        const src = getAttr(tokens, idx, 'src');
        const alt = getAttr(tokens, idx, 'alt') || '';

        // TODO: alt text is dropped for http?s:// URLs?
        
        if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
            return self.renderToken(tokens, idx, options);
        }
        
        return buildMediaHTML(src, alt);
    };

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

    function upsertPosition(project) {
        if (!project.data.position) {
            project.data.position = 999;
        }
        return project;
    }

    function fillInPositionData(projects) {
        for (let i = 0; i < projects.length; i++) {
          projects[i] = upsertPosition(projects[i]);
        }
        projects.sort((a, b) => {
          return a.data.position - b.data.position;
        });

        return projects;
    }

    // Omit archived projects, sort remaining in reverse order
    eleventyConfig.addCollection("project", function(collectionApi) {
        return collectionApi.getFilteredByTag("project").reverse().filter(post => {
            return !post.data.tags.includes("archive");
        }).sort((a, b) => {
            let _a = upsertPosition(a);
            let _b = upsertPosition(b);
            return _a.data.position - _b.data.position;
        });
    });

    // Simple collection that returns media type data for pagination
    eleventyConfig.addCollection("mediaTypes", function(collectionApi) {
        const projects = collectionApi.getFilteredByTag("project");        
        const mediaTypes = new Set();
        
        projects.forEach(project => {
          if (project.data.media && Array.isArray(project.data.media) && !project.data.tags.includes("archive")) {
            project.data.media.forEach(type => mediaTypes.add(type));
          }
        });
        
        // Return array of objects for pagination with CLEAN project data
        const result = Array.from(mediaTypes).map(type => {
          const slug = type.replace(/\s+/g, '-').toLowerCase();
          let projectsForType = projects.filter(project => 
            project.data.media && project.data.media.includes(type)
          );
          
          projectsForType = fillInPositionData(projectsForType);

          // console.log(`Media type "${type}" (${slug}): ${projectsForType.length} projects`);
          
          return {
            name: type,
            display: utils.titleCase(type),
            slug: slug,
            permalink: `/${slug}/`,  // Add permalink directly to the data
            projects: projectsForType
          };
        });
                
        return result;
      });

    // For "featured portfolio" projects, allow manual positioning
    eleventyConfig.addCollection("portfolio", function(collectionApi) {
        return collectionApi.getFilteredByTag("portfolio").sort((a, b) => {
            let _a = upsertPosition(a);
            let _b = upsertPosition(b);
            return _a.data.position - _b.data.position;
        });
    });

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