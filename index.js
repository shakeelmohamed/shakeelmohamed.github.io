var jade = require("jade");
var fs = require("fs");
var rss = require("node-rss");

// Create a function for compiling jade
var builder = jade.compileFile("./index.jade", {pretty: "    "});

// Read blogs.json as JSON
var blogs = JSON.parse(fs.readFileSync("./blogs.json").toString());

// Setup Jade variables
var globals = {
    "blogs": blogs,
    "socialLinks": {
        "GitHub": "https://github.com/shakeelmohamed",
        "Stack Overflow": "http://stackoverflow.com/users/2785681/shakeel",
        "LinkedIn": "http://linkedin.com/in/shakeelmohamed",
        "Goodreads": "https://www.goodreads.com/user/show/31081269-shakeel",
        "Twitter": "https://twitter.com/_shakeel",
        "Instagram": "http://instagram.com/shakeel_mohamed",
        "Facebook": "http://www.facebook.com/shakeelm"
    },
    "projects": [ // TODO: logo, screenshot, start/end date
        {
            "name": "Zen Audio Player",
            "url": "https://ZenPlayer.audio",
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
        },
        {
            "name": "Egress",
            "url": "https://shakeelmohamed.com/egress-bootstrap/",
            "source": "https://github.com/shakeelmohamed/egress-bootstrap",
            "description": "Start writing a web app already, with Twitter's Bootstrap framework"
        }
    ],
    "mentions": [
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
function buildRSSFeed(blogs) {
    var feed = rss.createNewFeed(
        "Shakeel Mohamed's Recent Blog Posts",
        "https://ShakeelMohamed.com/",
        "Recent Blog Posts",
        "contact@shakeelmohamed.com (Shakeel Mohamed)",
        "https://ShakeelMohamed.com/rss.xml"
        );
    blogs.forEach(function(blog) {
        feed.addNewItem(blog.title, blog.url, (new Date(blog.date)).toUTCString(), blog.description || "", {});
    });

    var xml = rss.getFeedXML(feed);

    fs.writeFile("./feed.xml", xml, function(err) {
        if (err) {
            console.error(err);
        }
        else {
            console.log("All done! 💯");
        }
    });
}

// Update index.html
fs.writeFile("./index.html", html, function(err) {
    if (err) {
        console.error(err);
    }
    else {
        buildRSSFeed(blogs);
    }
});