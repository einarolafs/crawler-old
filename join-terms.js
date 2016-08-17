//This function gets all the terms found in the terms folder and creates one object out of them all and saves in a single JSON file. The terms can than be used to search trough crawled data for relivent words and sentances.

const fs = require('fs');

terms = {};

const getPath = require("path").join(__dirname, "terms");


//Get a list of all the files in the terms folder 
fs.readdirSync(getPath).forEach(function(file) {

    let termfile = fs.readFileSync("./terms/" + file);
    termfile = JSON.parse(termfile);

    if (typeof termfile === 'object'){

    	//Join object from each file with the terms object
    	terms = Object.assign(terms, termfile);
	}



});

//Write the joined object to a JSON file
fs.writeFile('terms.json', JSON.stringify(terms), "utf8", function (err){
		      if (err) return console.log(err);
});