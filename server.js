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
        console.log(err);
      }
      else {
        response.json({result:result});
      }
  });

})

// all routes prefix with /api
app.use('/input', router);

// start the server man!!
app.listen(port);
