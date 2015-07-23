// call packages hard ballin af
    http       = require('http'),
    url        = require('url'),
    express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    parseString = require('xml2js').parseString;


// Use bodyParser() and get data from POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Set the port
var port = process.env.PORT || 8080

// API Routes
var router = express.Router();

function getPage(url, callback) {
  var request = http.get(url, function(response) {
    var body = '';

    response.on('data', function(chunk) {
      body += chunk
    });

    response.on('end', function() {
      parseString(body, function (error, result) {
        callback(result)
      });
    });

  })
}


// The main shit here boys
router.get('/', function(request, response) {
  var apiUrl = "http://api.wolframalpha.com/v2/query?appid=" + process.env.API_KEY + "&input=" + request.query.i + "&format=plaintext";
  getPage(apiUrl, function(result) {

    // API:
    // First result (0) contains info on user input
    // Second result contains result/input of input
    // Third result contains misc extra answers such as word value of a #
    // Fourth result contains extra misc shit we don't need to worry abt
    // Fifth result contains even more misc shit. Get to this later

    if (result.queryresult.$.success) {
      // Status returned is gucci
      try {

        var json = {
          success: true,
          type:   result.queryresult.$.datatypes,
          input:  result.queryresult.pod[0].subpod[0].plaintext[0],
          origin_url: 'http://www.wolframalpha.com/input/?i=' + encodeURIComponent(request.query.i),
          result: {
            plaintext: result.queryresult.pod[1].subpod[0].plaintext[0],
          }
        }

        // For now we're just grabbing simple info
        switch(json.type) {
          case "City,Weather": case "Weather":
            json.result.temperature = json['result']['plaintext'].substring(14, 19)
            // Still an issue if the weather only has one digit (or more than 2)

            delete json.result.plaintext
            break
          case "Math":
            json["result"]["words"] = result.queryresult.pod[2].subpod[0].plaintext[0]
            json["result"]["plaintext"] = json["result"]["plaintext"]
            break
          case "MathWorld":
            json['result']['plaintext'] = json['result']['plaintext']
            delete json['result']['plaintext']
            break
          case "Food":
            break
          case "Word":
            var plaintext = json.result.plaintext // 1 | noun | the fleshy part of the human body that you sit on
            var dict = plaintext.split(" | ") // [1, "noun", ]

            delete json["result"]["plaintext"]
            dict.splice(0, 1);

            json["result"]["word type"]  = dict[0]
            json["result"]["plaintext"] = dict[1].replace('\n2', ''); // "the fleshy part of the human body that you sit on"
            break
          default:
        }

        // Shoot of the Jason (best/fav son) response
        response.json({result: json});
      } catch(err) {
        // The fuck did the user search for
        // Adam's probably fucking around again smh

        var res = {
          result: {
            success: false,
            input: request.query.i,
            origin_url: 'http://www.wolframalpha.com/input/?i=' + encodeURIComponent(request.query.i),
          }
        }

        response.json(res);
      }
    }

  });
});

// All routes prefix with /input
app.use('/input', router);

// Start the server man!!
app.listen(port);
