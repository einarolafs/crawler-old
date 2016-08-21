var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

var tools = require(appRoot + '/app/tools.js');

//Store the terms database to use to search for sentences in the crawled content
let terms = fs.readFileSync(appRoot + '/tmp/terms.json');
terms = JSON.parse(terms);

var collect = function(source_body) {

            //Remove move any script tags and their content if they have been added into the body
            source_body.find('script, .tagcloud, [class*=nav], header, [class*=header], [class*=menu], link, nav, [class*=fb-root], [class*=footer], footer, [class*=extras], [class*=banner], img, [class*=widget]').remove();

            //Make the DOM static and remove all tags to leave only behind the text to use for the search
            const $content = source_body.html().replace(/<[^>]*>/gi, ' ');


            //tools.writeToFile(appRoot + '/tmp/content.txt', $content, false);



            //see the output of the body content
            //tools.writeToFile(appRoot + '/tmp/source.html', $('body'));

            var terms_found = {};

            var regexEscape = function(str)
            {
                return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            }

            var reg_term = function(term)
            {

                var flags;
                flags = 'gi';
                //console.log(term);
                term = regexEscape(term);
                //console.log(term);
                return new RegExp('\\b(' + term + ')\\b', flags)

            };


            for (var term_type in terms)
            {

                //console.log(typeof terms[term_type]);

                for (var term in terms[term_type])
                {


                    //console.log(terms[term_type]);
                    //  console.log(term);
                    //Turn all terms to uppercase to make sure if a word was added to the term file twice in different case settings that it is only mentioned once when collected
                    search_term = term.toUpperCase();

                    //Search for a metch using a function that looks throught all of the text for the term, will return null if nothing is found.
                    var search_for_match = $content.match(reg_term(search_term));

                    //If something is found add it to the object terms_found to be stored in a jons file later
                    if (search_for_match != null)
                    {
                        var add_term = terms_found[search_term] = terms_found[search_term] ||
                        {};

                        add_term['term_type'] = add_term['term_type'] ||
                        {};
                        add_term['term_type'][term_type] = search_for_match.length;


                    }
                }


            }

            //write out a log file for all terms and their position, -1 if not found
            //tools.writeToFile(appRoot + '/tmp/logtermsfound.json', log_term_position, true);
            tools.writeToFile(appRoot + '/tmp/termsfound.json', terms_found, true);
}


var crawl = function(url, header)
{
    reg = request.defaults(
    {
        jar: true,
        rejectUnauthorized: false,
        followAllRedirects: true
    });



    reg.get(
    {
        url: 'http://berlinstartupjobs.com/engineering/senior-backend-developer-hellofresh/',
        header:
        {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
        },
    }, function(error, response, body)
    {
        if (!error && response.statusCode == 200)
        {


            //write the response to a file
            //tools.writeToFile(appRoot + '/tmp/response.json', response, true);

            let $ = cheerio.load(body);

            const $source_body = $('body');

            collect($source_body);


        }
        else
        {
            console.error('something went wrong');
        }
    });


};

exports.crawl = crawl;
