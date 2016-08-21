var cheerio = require('cheerio');
var request = require('request');
var fs = require("fs");

var path = require('path');
global.appRoot = path.resolve(__dirname);

var tools = require('./app/tools.js');
var crawler = require('./app/crawler.js');

//Create a folder for temporary files meant to be used during development
var createTmpFolder = function()
{
    var dir = './tmp';

    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
}

crawler.crawl();

createTmpFolder();

