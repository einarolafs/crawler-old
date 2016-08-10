var fs = require('fs');
var terms = fs.readFileSync('terms.json');
terms = JSON.parse(terms);

console.log(terms);

// https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder

var normalizedPath = require("path").join(__dirname, "terms");



fs.readdirSync(normalizedPath).forEach(function(file) {

    var termfile = fs.readFileSync("./terms/" + file);
    termfile = JSON.parse(termfile);

    terms = Object.assign(terms, termfile);

    console.log(file);


});

fs.writeFile('terms.json', JSON.stringify(terms), "utf8", function (err){
		      if (err) return console.log(err);
});