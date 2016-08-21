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

exports.writeToFile = writeToFile;