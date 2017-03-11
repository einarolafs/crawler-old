//This function gets all the terms found in the terms folder and creates one object out of them all and saves in a single JSON file. The terms can than be used to search trough crawled data for relivent words and sentances.

var fs = require('fs');
var path = require('path');
global.appRoot = path.resolve(__dirname);
var tools = require(appRoot + '/app/tools.js');

//What else do we need here?

tools.createTmpDir();

var join_terms = function()
{
    terms = {};

    const getPath = path.join(__dirname, "terms");

    console.log(getPath);

    //Get a list of all the files in the terms folder 
    fs.readdirSync(getPath).forEach(function(file)
    {

        let termfile = fs.readFileSync("./terms/" + file);
        termfile = JSON.parse(termfile);

        //console.log("typeof: " + typeof termfile);
        term_name = file.replace(".json", "");
        // console.log(termfile);

        if (typeof termfile === 'object')
        {

            //Join object from each file with the terms object
            //terms = Object.assign(terms, termfile);
            for (term in termfile)
            {
                terms[term_name] = terms[term_name] || {};
                terms[term_name][termfile[term]] = true;
            }

        }



    });

    //Write the joined object to a JSON file
    tools.writeToFile("./tmp/terms.json", terms, true, true);

}

join_terms();