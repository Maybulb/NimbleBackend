// call packages hard ballin af
var https      = require('https');
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var Client     = require('node-wolfram');
var Wolfram    = new Client(process.env.API_KEY);

// use bodyParser() and get data from POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// set port!!
var port = process.env.PORT || 8080

// api routes
var router = express.Router();

// test api, make sure shit's working
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

        var final = {
          input: result.queryresult.pod[0].subpod[0].plaintext[0],
          result: result.queryresult.pod[1].subpod[0].plaintext[0]
        }

        response.json({result: final});
      }
  });

})

// all routes prefix with /input
app.use('/input', router);

// start the server man!!
app.listen(port);
