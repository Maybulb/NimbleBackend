// call packages hard ballin af
var https      = require('https');
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var Client     = require('node-wolfram');
var Wolfram    = new Client(process.env.API_KEY);

// Use bodyParser() and get data from POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Set the port
var port = process.env.PORT || 8080

// API Routes
var router = express.Router();

// The main shit here boys
router.get('/', function(request, response) {
  Wolfram.query(request.query.i, function(error, result) {
      if (error) {
        console.error(error);
      } else {
        // API:
        // First result (0) contains info on user input
        // Second result contains result/input of input
        // Third result contains misc extra answers such as word value of a #
        // Fourth result contains extra misc shit we don't need to worry abt
        // Fifth result contains even more misc shit. Get to this later

        if (result.queryresult.$.success) {
          // Status returned is gucci
          try {
            var final = {
              type:   result.queryresult.$.datatypes,
              input:  result.queryresult.pod[0].subpod[0].plaintext[0],
              result: {
                plaintext: result.queryresult.pod[1].subpod[0].plaintext[0],
              }
            }

            // Shoot of the Jason (best/fav son) response
            response.json({result: final});
          } catch(error) {
            // The fuck did the user search for
            // Adam's probably fucking around again smh
            response.send("Error: " + error + ". <a href=\"https://twitter.com/nulljosh\">Tell @nulljosh to clean up this mess >:(</a>")
          }
        }

      }
  });

})

// All routes prefix with /input
app.use('/input', router);

// Start the server man!!
app.listen(port);
