var jade = require("jade");
var fs = require("fs");

var blogs = JSON.parse(fs.readFileSync("./blogs.json").toString());

var fn = jade.compileFile("./index.jade");

var html = fn({"blogs": blogs});
console.log(html);

fs.writeFileSync("./test.html", html);