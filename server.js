var fs = require("fs");

//defingin a global varible to set the root directory of the application to be used by incloded scripts
var path = require('path');
global.appRoot = path.resolve(__dirname);

var tools = require('./app/tools.js');
var crawler = require('./app/crawler.js');

tools.createTmpDir();

crawler.crawl("http://berlinstartupjobs.com");

/*//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT = 8080;

//We need a function which handles requests and send response
function handleRequest(request, response)
{

    var location = appRoot + request.url; 
    var content;

    console.log(location);

    fs.readFile(location, function read(err, data)
    {
        if (err)
        {
            throw err;
        }

        content = data;
        response.end(content);
    });

    

}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function()
{
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
*/