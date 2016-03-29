'use strict';

console.log('Loading function');

var http = require("http")
    , APP_ID = ""
    , OurGroceriesClient = require('./our-groceries-client')
    , client = new OurGroceriesClient(APP_ID);

exports.handler = function(event, context) {
  console.log(event);
    client.authenticate(event.userName, event.password, function(result){
        console.log(result);
    });
}