var Client = require('node-wolfram');
var Wolfram = new Client(API_KEY);
Wolfram.query("what is 5 times 6 and 6 times 3", function(err, result) {
    if(err)
        console.log(err);
    else {
      console.log(result.queryresult.pod[1].subpod[0].plaintext[0]);
    }
});
