var fs = require("fs");

//defingin a global varible to set the root directory of the application to be used by incloded scripts
var path = require('path');
global.appRoot = path.resolve(__dirname);

var crawler = require('./app/tools.js');
var crawler = require('./app/crawler.js');

tools.createTmpDir();

crawler.crawl();

