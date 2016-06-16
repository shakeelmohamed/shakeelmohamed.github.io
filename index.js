var jade = require("jade");
var fs = require("fs");

// Read blogs.json as JSON
var blogs = JSON.parse(fs.readFileSync("./blogs.json").toString());

// Create a function for compiling jade
var builder = jade.compileFile("./index.jade", {pretty: "    "});

// Do the compilation
var html = builder({"blogs": blogs});

// Update index.html
fs.writeFile("./index.html", html, function(err) {
    if (err) {
        console.error(err);
    }
    else {
        console.log("All done! 💯");
    }
});