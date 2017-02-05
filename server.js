var fs = require("fs");

//defingin a global varible to set the root directory of the application to be used by incloded scripts
var path = require('path');
global.appRoot = path.resolve(__dirname);

// Count how many times the crawler has gone through a page
global.crawlCount = 0;


var tools = require('./app/tools.js');
var crawler = require('./app/crawler.js');

tools.createTmpDir();

global.urlToCrawl = process.argv[2];
global.mainDomain = urlToCrawl.match(/^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);


global.linkFile = appRoot + '/tmp/' + mainDomain[1] + '-links.json';

tools.writeToFile(linkFile, [process.argv[2]], true);


crawler.crawl(urlToCrawl);

// print process.argv
process.argv.forEach(function(val, index, array) {
    //console.log(index + ': ' + val);
});



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

/*var http = require('http');
var fs = require('fs');

var fileType = 'text/html';

function sendHtmlContent(url, processFile) {

    var filePath = './www' + url + '.html';
    var fileErr;
    var fileData;
    var format = 'utf8';

    if(url.match(/(css|png|ico|js|png|jpg)/)){
        filePath = './www' + url;
        format = undefined;
    }

    if(url.match(/css/)) {
        fileType = 'text/css';
    }
    else if (url.match(/js/)) {
        fileType = 'application/javascript';
    } 

    console.log(filePath);
    console.log(fileType);



    fs.readFile(filePath, format, function read(err, data) {
        if (err) {
            //sendHtmlContent('/404');
            console.log('error: ' + err);

            fileErr = true;
        }

        fileData = data;

        //console.log(data);

        // console.log('data: ' + filedata);

        // Invoke the next step here however you like
        //console.log(content);   // Put all of the code here (not the best solution)
        processFile(fileErr, fileData); // Or put the next step in a function and invoke it
    });
}

http.createServer(function(req, res) {
    //console.dir(req.url == '/crawl');

    // will get you  '/' or 'index.html' or 'css/styles.css' ...
    // • you need to isolate extension
    // • have a small mimetype lookup array/object
    // • only there and then reading the file
    // •  delivering it after setting the right content type



    

    if (req.url == '/crawl') {
        crawler.crawl(urlToCrawl);
    } else if (req.url != '/') {
        // console.log('not index');
        sendHtmlContent(req.url, function(err, data) {

            //console.log(data);
            res.writeHead(200, { 'Content-Type': fileType });

            if (err) {
                sendHtmlContent(path, function(err, data) {res.end(data)});
            } else {
                res.end(data);
            }


        });

    } else {
        //console.log('index');;
        sendHtmlContent('/index', function(err, data) {

            //console.log(data);
            res.writeHead(200, { 'Content-Type': fileType });

            if (err) {
                sendHtmlContent(path, function(err, data) {res.end(data)});
            } else {
                res.end(data);
            }


        });

        //console.log(sendContent('/index'));
    }

}).listen(8000);
*/