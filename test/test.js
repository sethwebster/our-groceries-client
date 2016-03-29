var handler = require('../src/index.js')
  , env = require('node-env-file');
    
var context = {
  succeed: function(err, result) {
    console.log("Error: ", err);
    console.log("Result", result);
  }
}

var event = {
  userName: process.env.OUR_GROCERIES_USERNAME,
  password: process.env.OUR_GROCERIES_PASSWORD,
  list: "Trader Joe's",
  item: "Apples"
}

console.log(event);

handler.handler(event, context);