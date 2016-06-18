var jade = require("jade");
var fs = require("fs");

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
            "name": "Egress",
            "url": "https://shakeelmohamed.com/egress-bootstrap/",
            "source": "https://github.com/shakeelmohamed/egress-bootstrap",
            "description": "Start writing a web app already, with Twitter's Bootstrap framework"
        }
    ]
};

// Do the compilation
var html = builder(globals);

// Update index.html
fs.writeFile("./index.html", html, function(err) {
    if (err) {
        console.error(err);
    }
    else {
        console.log("All done! 💯");
    }
});