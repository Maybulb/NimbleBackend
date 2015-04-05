// call packages hard ballin af
var https      = require('https'),
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

function getPage(response, page) {
  http.request(url.parse(page), function(res) {
    var buffer = '';

    res.on('data', function(chunk) {
      buffer += chunk;
    });

    res.on('end', function() {
      response.send(buffer);
    });
  });
}


// The main shit here boys
router.get('/', function(request, response) {
  var apiUrl = "http://api.wolframalpha.com/v2/query?appid=" + process.env.API_KEY + "&input=" + request.query.i + "&format=plaintext";
  var xml = getPage(response, apiUrl);
  response.send(xml)
});

// All routes prefix with /input
app.use('/input', router);

// Start the server man!!
app.listen(port);



// // API:
// // First result (0) contains info on user input
// // Second result contains result/input of input
// // Third result contains misc extra answers such as word value of a #
// // Fourth result contains extra misc shit we don't need to worry abt
// // Fifth result contains even more misc shit. Get to this later
//
// if (result.queryresult.$.success) {
//   // Status returned is gucci
//   try {
//
//     var final = {
//       success: true,
//       type:   result.queryresult.$.datatypes,
//       input:  result.queryresult.pod[0].subpod[0].plaintext[0],
//       result: {
//         plaintext: result.queryresult.pod[1].subpod[0].plaintext[0],
//       }
//     }
//
//     switch(final.type) {
//       case "City,Weather":
//         break
//       case "Math":
//         final["result"]["words"] = result.queryresult.pod[2].subpod[0].plaintext[0]
//         final["result"]["plaintext"] = final["result"]["plaintext"]
//         break
//       case "Food":
//         break
//       case "Word":
//         var plaintext = final.result.plaintext // 1 | noun | the fleshy part of the human body that you sit on
//         var dict = plaintext.split(" | ") // [1, "noun", ]
//
//         delete final["result"]["plaintext"]
//         dict.splice(0, 1);
//
//         final["result"]["word type"]  = dict[0]
//         final["result"]["definition"] = dict[1].replace('\n2', ''); // "the fleshy part of the human body that you sit on"
//         break
//       default:
//     }
//
//     // Shoot of the Jason (best/fav son) response
//     response.json({result: final});
//   } catch(err) {
//     // The fuck did the user search for
//     // Adam's probably fucking around again smh
//     response.json({result: {success: false, input: request.query.i}})
//   }
// }
