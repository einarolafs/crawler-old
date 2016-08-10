var cheerio = require('cheerio');
var request = require('request');
var fs = require("fs");

reg = request.defaults({
  jar:true,
  rejectUnauthorized: false,
  followAllRedirects: true
});

function WriteTo(filename, content, json = false){
  if(json){
    fs.writeFile(filename, JSON.stringify(content), "utf8", function (err){
      if (err) return console.log(err);
    });
  } else {
    fs.writeFile(filename, content, "utf8", function (err){
      if (err) return console.log(err);
    });
  }

}

reg.get({
  url: 'http://www.w3schools.com/jsref/jsref_touppercase.asp',
  header : {
    'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
  },
},  function (error, response, body) {
  if (!error && response.statusCode == 200) {


 //write the response to a file
    WriteTo("response.json", response, true);

    let $ = cheerio.load(body);



    var $source_body = $('body');
    $source_body.find("script").remove();
    var $content = $source_body.find("*").text();



    //see the output of the body content
    WriteTo("source.html", $('body'));

    $content = $content.replace(/\s\s+/g, ' ');

    $content = $content.split(" ");

    $content = $content.sort();

    $contentObj = new Object();

    wlength = $content.length;

    console.log(wlength);

    for (var i = 0; i < wlength; i++) {
        if ($contentObj[$content[i]] >= 1) {
          $contentObj[$content[i]] = $contentObj[$content[i]] + 1;
        }
        else {
          $contentObj[$content[i]] = 1;
        }
    }


        fs.writeFile( "words.json", JSON.stringify($contentObj, null, 2), "utf8", function (err){
          if (err) return console.log(err);
        });

  }
  else {
    console.error("something went wrong");
  }
});
