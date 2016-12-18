var fs = require('fs');

var writeToFile = function(filename, content, json = false)
{

    if (json)
    {
        fs.writeFile(filename, JSON.stringify(content), "utf8", function(err)
        {
            if (err) return console.log(err);
        });
    }
    else
    {
        fs.writeFile(filename, content, "utf8", function(err)
        {
            if (err) return console.log(err);
        });
    }

    //console.log("writing: " + filename);

};

//Create a folder for temporary files meant to be used during development
var createTmpDir = function()
{
    var dir = './tmp';

    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
}

var loopThroughDomains = function(domain) {
    var thedomains;
}

exports.writeToFile = writeToFile;
exports.createTmpDir = createTmpDir;