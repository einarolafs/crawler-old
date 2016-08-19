const cheerio = require('cheerio');
const request = require('request');
const fs = require("fs");

//Create a folder for temporary files meant to be used during development
var createTmpFolder = function()
{
    var dir = './tmp';

    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
}

createTmpFolder();

//Store the terms database to use to search for sentences in the crawled content
let terms = fs.readFileSync('./tmp/terms.json');
terms = JSON.parse(terms);



reg = request.defaults(
{
    jar: true,
    rejectUnauthorized: false,
    followAllRedirects: true
});

function WriteTo(filename, content, json = false)
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

}

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
        WriteTo("./tmp/response.json", response, true);

        let $ = cheerio.load(body);



        const $source_body = $('body');

        //Remove move any script tags and their content if they have been added into the body
        $source_body.find("script, .tagcloud, [class*=nav], header, [class*=header], [class*=menu], link, nav, [class*=fb-root], [class*=footer], footer, [class*=extras], [class*=banner], img, [class*=widget]").remove();

        //Search for all elements and get their text
        const $content = $source_body.html().replace(/<[^>]*>/gi, " ");


        WriteTo("./tmp/content.txt", $content, false);



        //see the output of the body content
        WriteTo("./tmp/source.html", $('body'));

        var log_term_position = {};
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

        var search_for_match = $content.match(reg_term('after'));

        //console.log(search_for_match);


        for (var term in terms)
        {

            var search_for_match = $content.match(reg_term(term));

            if (search_for_match != null)
            {
                terms_found[term] = search_for_match.length;
            }


        }

        //write out a log file for all terms and their position, -1 if not found
        //WriteTo("./tmp/logtermsfound.json", log_term_position, true);
        WriteTo("./tmp/termsfound.json", terms_found, true);

    }
    else
    {
        console.error("something went wrong");
    }
});
