'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var request = require('request')
    , urls = require('./urls')
    , jar = request.jar()
    , defaultHandler = require('./default-handler');

var request = request.defaults({
  jar: jar,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
  }
})

function OurGroceriesClient(appId) {
  this._appId = appId;
}

OurGroceriesClient.prototype.authenticate = function(username, password, complete) {
  complete = complete || defaultHandler;
  console.log("Authenticating");
  var self = this;
  request.post({
    url:urls.signIn,
    form: {
      emailAddress:username,
      action:"sign-in",
      password:password,
      staySignedIn:"on"
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
      'Referer': 'https://www.ourgroceries.com/sign-in',
      'Origin': 'https://www.ourgroceries.com'
    }
  }, function(err, response, body) {
    if (err) {
      console.log("Error Authenticating: "+err);
      complete({success:false, error:err});
    } else {
      self.auth = jar.getCookieString(urls.signIn);
      if (self.auth) {
        console.log("Success");
        self.getTeamId(function(teamIdResponse) {
          if (teamIdResponse.success) {
            self.teamId = teamIdResponse.teamId;
            complete({success:true});
          } else {
            complete(teamIdResponse);
          }
        });
      } else {
        complete({success:false,error:"Invalid Credentials"});
      }
    }
  });
}

OurGroceriesClient.prototype.getTeamId = function(complete) {
  complete = complete || defaultHandler;
  console.log("Getting team id");
  request(urls.yourLists, function(err, response, body) {
    if (err) {
      console.log("Error getting team id:"+err);
      complete({success:false, error:err});
    } else {
      var regex = /g_teamId = \"([A-Za-z0-9]*)\"/gm;
      var teamId = regex.exec(body)[1];
      console.log("Success fetching team id: "+teamId);
      complete({success:true, teamId:teamId});
    }
  });
}
//{"recipes":[],"shoppingLists":[{"activeCount":0,"name":"Duane Reade","id":"IiYWzpD8UeuLOoC-c6iEda"},{"activeCount":1,"name":"Fairway","id":"HeRpch6y09FJ10Vrxkekxt"},{"activeCount":3,"name":"Health Nuts","id":"C-NhAwDy061LKS3K7PZmri"},{"activeCount":0,"name":"Staples","id":"CVa5TtIWkkFJXBb9ILUppr"},{"activeCount":6,"name":"Trader Joes","id":"PStVFIyKkj5K6GPaxUJynn"},{"activeCount":3,"name":"West Side Market","id":"WHfkG3KbqpviqQSiP0B8Rd"},{"activeCount":0,"name":"Whole Foods","id":"qcrVcp5fhT0KecyOACaAkS"}],"command":"getOverview"}
OurGroceriesClient.prototype.getLists = function(complete) {
  complete = complete || defaultHandler;
  var self = this;
  request.post({
    url:urls.yourLists,
    headers: {
      Accept: "application/json, text/javascript, */*",
      Origin: "https://www.ourgroceries.com",
      Referer: "https://www.ourgroceries.com/your-list",
      "X-Requested-With": "XMLHttpRequest",
      "Host": "www.ourgroceries.com",
      "Content-Type": "application/json"
    },
    json: { command: "getOverview", teamId: self.teamId }
  }, function(err, response, body) {
    if (err) {
      complete({success:false, error:err});
    } else {
      complete({success:true, response:body});
    }
  });
}

OurGroceriesClient.prototype.addToList = function(listId, itemName, quantity, complete) {
  complete = complete || defaultHandler;
  var self = this;

  //Append quantity to item name if supplied, which server will parse on its side
  if(quantity && quantity > 1) {
	  itemName += ' (' + quantity + ')';
  }

  request.post({
    url:urls.yourLists,
    headers: {
      Accept: "application/json, text/javascript, */*",
      Origin: "https://www.ourgroceries.com",
      Referer: "https://www.ourgroceries.com/your-list",
      "X-Requested-With": "XMLHttpRequest",
      "Host": "www.ourgroceries.com",
      "Content-Type": "application/json"
    },
    json: { command: "insertItem", teamId: self.teamId, listId:listId, value:itemName }
  }, function(err, response, body) {
    if (err) {
      complete({success:false, error:err});
    } else {
      complete({success:true, response:body});
    }
  });
}

OurGroceriesClient.prototype.uncrossOff = function( itemId, listId, complete) {
  complete = complete || defaultHandler;
  var self = this;


  request.post({
    url:urls.yourLists,
    headers: {
      Accept: "application/json, text/javascript, */*",
      Origin: "https://www.ourgroceries.com",
      Referer: "https://www.ourgroceries.com/your-list",
      "X-Requested-With": "XMLHttpRequest",
      "Host": "www.ourgroceries.com",
      "Content-Type": "application/json"
    },
    json: {command:"setItemCrossedOff", itemId: itemId, listId:listId, crossedOff:false, teamId:self.teamId }
  }, function(err, response, body) {
    if (err) {
      complete({success:false, error:err});
    } else {
      complete({success:true, response:body});
    }
  });
}

OurGroceriesClient.prototype.getList = function(listId, complete) {
  complete = complete || defaultHandler;
  var self = this;

  request.post({
    url:urls.yourLists,
    headers: {
      "Accept": "application/json, text/javascript, */*",
      "Origin": "https://www.ourgroceries.com",
      "Referer": "https://www.ourgroceries.com/your-list",
      "X-Requested-With": "XMLHttpRequest",
      "Host": "www.ourgroceries.com",
      "Content-Type": "application/json"
    },
    json: { command: "getList", teamId: self.teamId, listId:listId }
  }, function(err, response, body) {
    if (err) {
      complete({success:false, error:err});
    } else {
      complete({success:true, response:body});
    }
  });
}

OurGroceriesClient.prototype.findList = function(lists, listName) {
  listName = listName.toLowerCase().replace(/\W/g, '');
  var allLists = lists.map((item) => {
    item.matchName = item.name.toLowerCase().replace(/\W/g, '');
    return item;
  });
  var candidates = allLists.filter((item) => item.matchName.indexOf(listName) === 0 || listName.indexOf(item.matchName) === 0);
  return candidates.length > 0 ? candidates[0] : null;
}

module.exports = OurGroceriesClient;
