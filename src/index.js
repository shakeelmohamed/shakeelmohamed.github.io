var pug = require("pug");
var fs = require("fs");
var RSS = require("rss");
var path = require("path");
var showdown  = require("showdown");
var showdownHighlight = require("showdown-highlight");
var Async = require("async");

// Create a function for compiling pug
var builder = pug.compileFile(path.join(__dirname, "./views/index.pug"), {pretty: "    "});

// Read blogs.json as JSON
var blogs = JSON.parse(fs.readFileSync(path.join(__dirname, "./data/blogs.json")).toString());

// TODO: once all medium.com posts are migrated into this repo, turn on medium monetization

// TODO: add a prebuild step to run some validation that all posts are in blogs.json
// Build the blog pages first and update their URLs
function buildBlogPages(blogs) {
    var postBuilder = pug.compileFile(path.join(__dirname, "./views/post.pug"), {pretty: "    ", filename: path.join(__dirname, "./views/post.pug")});
    var converter = new showdown.Converter({metadata: true, extensions: [showdownHighlight]});
    for (var i = 0; i < blogs.length; i++) {
        // Skip external posts
        if (!blogs[i].source) {
            continue;
        }

        var sourceDir = blogs[i].source;
        var sourcePath = path.join(__dirname, "src", sourceDir);
        var dirName = path.basename(blogs[i].source);
        var mdFile = path.join(sourceDir, "post.md");
        var mdPath = path.join(__dirname, 'src', mdFile);
        if (!fs.existsSync(sourcePath)) {
            throw new Error("SourceDir doesn't look right " +  JSON.stringify(blogs[i]));
        }
        if (!fs.existsSync(mdPath)) {
            throw new Error("mdPath doesn't look right " +  JSON.stringify(blogs[i]));
        }

        // open graph override
        blogs[i].og = blogs[i].og || {};
        blogs[i].og.title = "Shakeel Mohamed | " + blogs[i].title;
        if (blogs[i].og.image) {
            blogs[i].og.image = "https://shakeelmohamed.com/" + path.join(sourceDir, blogs[i].og.image).replace("../", "");
        } else {
            blogs[i].og.image = "https://shakeelmohamed.com/img/shakeel-mohamed-opengraph.png";
        }

        // For posts before 1 directory per post
        if (blogs[i].canonical) {
            var rawMarkdown = fs.readFileSync(mdPath).toString();
            rawMarkdown = rawMarkdown.replace("](./", "](./" + dirName + "/"); // Fix relative paths, mostly images
            blogs[i].content = converter.makeHtml(rawMarkdown);
            var legacyPageHTML = postBuilder({"post": blogs[i], "relativePrefix": ".."});
            var legacyFileName = blogs[i].source + ".html";
            writeFileSync(["..", "posts", legacyFileName], legacyPageHTML);
            delete blogs[i].content;
        }
        
        blogs[i].content = converter.makeHtml(fs.readFileSync(mdPath).toString());
        var pageHTML = postBuilder({"post": blogs[i], "relativePrefix": "../.."});
        if (!fs.existsSync(path.join(__dirname, "..", "posts", sourceDir))) {
            fs.mkdirSync(path.join(__dirname, "..", "posts", sourceDir));    
        }
        writeFileSync(["..", "posts", sourceDir, "index.html"], pageHTML);

        // Move images from src/posts/${dirName}/ to posts/${dirName}
        var sourceFiles = fs.readdirSync(sourcePath);
        for (var j = 0; j < sourceFiles.length; j++) {
            if (sourceFiles[j].length > 3 && (sourceFiles[j].endsWith('.jpg') || sourceFiles[j].endsWith('.png'))) {
                console.log("Moving this image out of src", dirName, sourceFiles[j]);
                var oldPath = path.join(sourcePath, sourceFiles[j]);
                var newPath = oldPath.replace("src/", "");
                fs.renameSync(oldPath, newPath);
            }
        }

        blogs[i].url = encodeURI(path.join("posts", dirName));
        delete blogs[i].source;
    }
    return blogs;
}

// Setup Pug variables
var globals = {
    "blogs": buildBlogPages(blogs),
    "socialLinks": {
        "LinkedIn": "http://linkedin.com/in/shakeelmohamed",
        "Instagram": "http://instagram.com/shakeelxyz",
        "Goodreads": "https://www.goodreads.com/user/show/31081269-shakeel",
        "Facebook": "http://www.facebook.com/Shakeelxyz",
        "Behance": "https://www.behance.net/shakeelxyz",
        "Clubhouse": "https://joinclubhouse.com/@shakeelxyz",
        "Twitter": "https://twitter.com/_shakeel",
        "GitHub": "https://github.com/shakeelmohamed"
    },
    "sitemap": [
        "https://shakeelmohamed.com/",
        "https://shakeelmohamed.com/feed.xml",
        "https://shakeelmohamed.com/angular-geocoding-demo",
        "https://shakeelmohamed.com/htmlslyde"
    ],
    "projects": [ // TODO: logo, screenshot, start/end date
        {
            "name": "Zen Audio Player",
            "url": "https://zen-audio-player.github.io/",
            "source": "https://github.com/zen-audio-player",
            "description": "Listen to YouTube videos without the distracting visuals"
        },
        {
            "name": "Splunk Conf File Syntax Highlighting",
            "url": "https://packagecontrol.io/packages/Splunk%20Conf%20File%20Syntax%20Highlighting",
            "source": "https://github.com/shakeelmohamed/sublime-splunk-conf-highlighting",
            "description": "Syntax highlighting for Splunk .conf files in Sublime Text 2 & 3"
        },
        {
            "name": "Flippy Flop",
            "url": "https://github.com/flippy-flop",
            "source": "https://github.com/flippy-flop/ff-js",
            "description": "An unpredictable data structure."
        }
    ],
    "mentions": [
        {
            "date": "March 12, 2021",
            "title": "Agile Mentality in Business with Love Nescio - @lovenescio on Instagram",
            "url": "https://www.instagram.com/p/CMVpHC7AeDk/"
        },
        {
            "date": "Aug 04, 2020",
            "title": "Announcing the Newest Version of SimData",
            "url": "https://www.splunk.com/en_us/blog/tips-and-tricks/introducing-simdata-v1-2.html"
        },
        {
            "date": "July 20, 2020",
            "title": "Congratulations to the new IPN national leadership team on their appointments! - @officialipn on Instagram",
            "url": "https://www.instagram.com/p/CC4tWpHlI2k/"
        },
        {
            "date": "May 21, 2020",
            "title": "Meet Shakeel Mohamed. He's the founder of ntrsct designs - @thehealthaisle on Instagram",
            "url": "https://www.instagram.com/p/CAeR7YonA2x/"
        },
        {
            "date": "Feb 9, 2020",
            "title": "Meet Our National Product Manager, IPNOnline - @officialipn on Instagram",
            "url": "https://www.instagram.com/p/B8XHtvSlSyA/",
        },
        {
            "date": "March 11, 2019",
            "title": "Inspiring the Next Generation in Cybersecurity at CodeDay",
            "url": "https://www.splunk.com/content/splunk-blogs/en/2019/03/11/inspiring-the-next-generation-in-cybersecurity-at-codeday.html",
        },
        {
            "date": "October 5, 2017",
            "title": "Maintainer Burden Group Therapy - Node.js Interactive 2017 Vancouver, BC",
            "url": "https://www.youtube.com/watch?v=_Afog6J1pcA&t=6m36s",
        },
        {
            "date": "January 6, 2016",
            "title": "An Hour of Code with Splunk",
            "url": "http://blogs.splunk.com/2016/01/06/an-hour-of-code-with-splunk/",
        },
        {
            "date": "June 14, 2015",
            "title": "Commencement pride shines for Seattle University grads",
            "url": "http://www.seattletimes.com/photo-video/photography/commencement-pride-shines-for-seattle-university-grads/"
        },
        {
            "date": "March 25, 2015",
            "title": "The Splunk SDK for JavaScript gets support for Node.js v0.12 and io.js!",
            "url": "https://www.splunk.com/en_us/blog/tips-and-tricks/the-splunk-sdk-for-javascript-gets-support-for-node-js-v0-12-and-io-js.html"
        },
        {
            "date": "September 17, 2014",
            "title": "New support for authoring modular inputs in Node.js",
            "url": "https://www.splunk.com/en_us/blog/tips-and-tricks/new-support-for-authoring-modular-inputs-in-node-js.html"
        },
        {
            "date": "September 10, 2013",
            "title": "The Splunk SDK for Python gets modular input support",
            "url": "https://www.splunk.com/en_us/blog/tips-and-tricks/the-splunk-sdk-for-python-gets-modular-input-support.html"
        },
        {
            "date": "August 23, 2012",
            "title": "Meet the 7 startup teams in StudentRND's summer incubator",
            "url": "http://www.geekwire.com/2012/meet-teams-student-rnd-summer-incubator/"
        },
        {
            "date": "February 28, 2012",
            "title": "BC Computer Science Club",
            "url": "http://www.thewatchdogonline.com/bc-computer-science-club-8639"
        }
    ]
};

// Do the compilation
var html = builder(globals);

// Build the RSS feed
function buildRSSFeed(blogs, done) {
    var feed = new RSS({
        title: "Shakeel Mohamed's Recent Blog Posts",
        description: "Recent Blog Posts",
        feed_url: "https://ShakeelMohamed.com/rss.xml",
        site_url: "https://ShakeelMohamed.com/",
        webMaster: "iam@shakeel.xyz (Shakeel Mohamed)"
    });

    blogs.forEach(function(blog) {
        // TODO: need the url
        feed.item({
            title: blog.title,
            description: blog.description || "",
            author: "iam@shakeel.xyz (Shakeel Mohamed)",
            date: new Date(blog.date),
        });
    });

    var xml = feed.xml({indent: true});
    writeFile("../feed.xml", xml, done);
}

function buildPostListPage(blogs) {
    var builder = getPugBuilder("post-list");
    var pageArgs = globals;
    pageArgs.blogs = blogs;
    pageArgs.relativePrefix = "..";
    for (var i = 0; i < pageArgs.blogs.length; i++) {
        pageArgs.blogs[i].url = pageArgs.blogs[i].url.replace("posts/", "");
    }
    var content = builder(pageArgs);
    writeFileSync(["../posts", "index.html"], content);
}

function writeFileSync(destinations, contents) {
    destinations.unshift(__dirname);
    return fs.writeFileSync(path.join(...destinations), contents);
}

function writeFile(destination, contents, done) {
    fs.writeFile(path.join(__dirname, destination), contents, done);
}

function getPugBuilder(viewName) {
    return pug.compileFile(path.join(__dirname, `./views/${viewName}.pug`), {pretty: "    "});
}

function buildSitemap(blogs) {
    var prefix = globals.sitemap[0];
    var sitemap = globals.sitemap.join("\n");
    blogs.forEach(function(blog) {
        if (blog.url.indexOf("http") !== 0) {
            sitemap += `\n${prefix}${blog.url}`;
        }
    });

    writeFileSync(["../sitemap.txt"], sitemap);
}

Async.waterfall([
    function(done) {
        // TODO: clean up html files for md files that don't exist
        writeFile("../index.html", html, done);
    },
    function(done) {
        buildSitemap(blogs);
        buildPostListPage(blogs);
        buildRSSFeed(blogs, done);
    }],
    function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log("All done! 💯");
        }
    }
);

