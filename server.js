var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var wolfram = require('wolfram-alpha').createClient(process.env.API_KEY, {
  width: 348
});
var port, router;


// Use bodyParser() and get data from POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

port = process.env.PORT || 8080
router = express.Router();


// The main shit here boys
router.get('/', function(request, response) {
  wolfram.query(request.query.i, function(err, result) {
    if (err) throw err;
    var url = 'http://www.wolframalpha.com/input/?i=' + encodeURIComponent(request.query.i);
    result.push({origin_url:url})
    response.json(result);
  });
});

// All routes prefix with /input
app.use('/input', router);

app.listen(port);
