var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

var tools = require(appRoot + '/app/tools.js');

//Store the terms database to use to search for sentences in the crawled content
let terms = fs.readFileSync(appRoot + '/tmp/terms.json');
terms = JSON.parse(terms);


let stop = 0;

// First regex escapes all characters that could conflicted with terms used from the dictionary when it is run trough the second function
var regex = {
    escape: function(str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    },
    term: function(term) {

        var flags;
        flags = 'gi';
        //console.log(term);
        term = regex.escape(term);
        //console.log(term);
        return new RegExp('\\b(' + term + ')\\b', flags)

    }
}


var collect = function(source_body, page_url, callback) {

    console.log(page_url);


    //Remove any script tags and their content if they have been added into the body
    source_body.find('script, .tagcloud, [class*=nav], header, [class*=header], [class*=menu], link, nav, [class*=fb-root], [class*=footer], footer, [class*=extras], [class*=banner], img, [class*=widget]').remove();

    //Make the DOM static and remove all tags to leave only behind the text to use for the search
    const $content = source_body.html().replace(/<[^>]*>/gi, ' ');


    //tools.writeToFile(appRoot + '/tmp/content.txt', $content, false);



    //see the output of the body content
    //tools.writeToFile(appRoot + '/tmp/source.html', $('body'));

    //Empty object to be used to store terms in
    var terms_found = {};


    for (var term_type in terms) {

        //console.log(typeof terms[term_type]);

        for (var term in terms[term_type]) {


            //console.log(terms[term_type]);
            //  console.log(term);
            //Turn all terms to uppercase to make sure if a word was added to the term file twice in different case settings that it is only mentioned once when collected
            search_term = term.toUpperCase();

            //Search for a metch using a function that looks through all of the text for the term, will return null if nothing is found.
            var search_for_match = $content.match(regex.term(search_term));

            //If something is found add it to the object terms_found to be stored in a jons file later
            if (search_for_match != null) {
                var add_term = terms_found[search_term] = terms_found[search_term] || {};

                add_term['term_type'] = add_term['term_type'] || {};
                add_term['term_type'][term_type] = search_for_match.length;


            }
        }


    }

    var sitesDir = './tmp/sites';

    if (!fs.existsSync(sitesDir)) {
        fs.mkdirSync(sitesDir);
    }

    //write out a log file for all terms and their position, -1 if not found
    //tools.writeToFile(appRoot + '/tmp/logtermsfound.json', log_term_position, true);
    tools.writeToFile(appRoot + '/tmp/sites/' + page_url + '-termsfound.json', terms_found, true);

    callback();

}


var crawl = function(url, header) {
    var page_url = url.replace('http://', '');
    page_url = page_url.replace(/\//g, '_');

    crawlCount = crawlCount + 1;
    //console.log(crawlCount);

    getPageContent(url, page_url);

};


function getPageContent(url, page_url) {
    reg = request.defaults({
        jar: true,
        rejectUnauthorized: false,
        followAllRedirects: true
    });

    reg.get({
        url: url,
        header: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
        },
    }, function(error, response, body) {

        if (!error && response.statusCode == 200) {

            crawlOnSuccess(error, response, body, page_url);


        } else {
            console.log('something went wrong');
            //tools.writeToFile(appRoot + '/tmp/sites/' + page_url + 'error.txt', error);
            console.log(error);
        }
    });
}

function crawlOnSuccess(error, response, body, page_url) {
    //write the response to a file
    //tools.writeToFile(appRoot + '/tmp/response.json', response, true);

    let $ = cheerio.load(body);

    const $source_body = $('body');

    // tools.writeToFile(appRoot + '/tmp/sites/' + page_url + '.html', $source_body, false);

    // Run through the content of the page and collect phrases to save, then run script to look through the links on the page to add to the collective file.
    collect($source_body, page_url, findNextLink);


    function findNextLink() {


        //Turn the cheerio DOM code to string and then match with all hrefs in the file
        pageLinks = $source_body.html().match(/href="([^\'\"]+)/g);

        //console.log(pageLinks.length);

        // console.log(pageLinks.length);

       // linkFile = appRoot + '/tmp/' + mainDomain[1] + '-links.json';
      //  var linkFileSync = fs.existsSync(linkFile);
        let linkFileContent;

        // If a collective link file exists for this domain, than write it out to check and update
   
        linkFileContent = fs.readFileSync(linkFile);
        linkFileContent = JSON.parse(linkFileContent);
    

        for (count = crawlCount; count < pageLinks.length; count++) {

            pageLinks[count] = pageLinks[count].replace('href="', '');


            if (pageLinks[count].indexOf('mailto') > -1 || pageLinks[count].indexOf('#') == 0) {
                pageLinks.splice(count, 1);
            }

            // Check if there is already a collective link file for this domain

            //console.log(pageLinks[count].indexOf('http'));

         

                // Check if this url can not be found in the collective link file, if not than add it to the array
                // console.log('indexOf: ' + linkFileContent.indexOf(pageLinks[count]));

                if (linkFileContent.indexOf(pageLinks[count]) <= -1) {
                    linkFileContent.push(pageLinks[count]);
        
            }



            // console.log('worked '+ count + ' of ' + pageLinks.length);

            if (count == (pageLinks.length - 1)) {

               /* var linkContent;

                if (linkFileContent) {
                    linkContent = linkFileContent;
                } else {
                    linkContent = pageLinks;
                }
*/

                tools.writeToFile(linkFile, linkFileContent, true);

                crawlNextUrl(linkFileContent);
            }
        }

        // Write a new file with the updated links


        //console.log('linkFileContent length is: ' + linkFileContent.length)


        // if (callback) callback(linkFileContent[crawlCount]);

        /* 
          pageLinks.each(function()
          {

              var next_url = $(this).attr('href');
              pageLinks_Object.push(next_url);

              if (count == pageLinks.length) {

              };


              //Use stop variable to stop after reaching certain amount of url's and heck if the url begins with http
              if (stop <= 100 && next_url.substring(0, 4) == "http")
              {
                  setTimeout(function()
                  {
                      crawl(next_url);

                  }, 10000);

                  stop = stop + 1;

                  console.log("stop is at: " + stop);

              }
              else {
                  //console.log(next_url.substring(0, 4);
              }

          });*/
        // console.log('the length is = ' + typeof pageLinks);

        // end of findNextLink() function
    }

    // Function to fire after checking for new urls to add to the collective list file


    //tools.writeToFile(appRoot + '/tmp/sites/' + page_url + '-links.json', pageLinks_Object, true);
}

function crawlNextUrl(linkContent) {

    console.log(linkContent);

    //console.log('write a file and crawl next');

    if (crawlCount <= linkContent.length) {
        crawl(linkContent[crawlCount]);
    }
}



exports.crawl = crawl;
