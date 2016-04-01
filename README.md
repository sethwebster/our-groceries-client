# Our Groceries Client

Current Features
 * Provides Authentication
 * Allows Retrieval of User's grocery lists
 * Allows addition of items to lists

### Installation
```
npm install our-groceries-client
```

### Usage

```javascript
var OurGroceriesClient = require('our-groceries-client');
// or import OurGroceriesClient from 'our-groceries-client' 

var username = "<your our groceries username>"
  , password = "<your our groceries password>"
  , listName = "<your list name>"
  , itemName = "Apples"
  , quantity = 1;

var client = new OurGroceriesClient();

var handlers = {   
    // Called when authentication completes, either success or failure 
    authComplete: function(result) {
        if (result.success) {
            client.getLists(handlers.getListsComplete);
        } else {
            console.log("Authentication Failed: "+result.error);
        }
    },
    // Called when fetching the list of lists completes, either success or failure 
    getListsComplete: function(result) {
        if (result.success) {
            var list = client.findList(result.response.shoppingLists, listName);
            if (list) {
                client.getList(list.id, handlers.getListComplete);                
            } else {
                console.log("Unable to find list: "+listName);
            }
        } else {
            console.log("Unable to get lists: "+result.error);
        }
    },
    // Called when fetching a single list completes, either success or failure 
    getListComplete: function(result) {
        var list = result.response.list;
        client.addToList(list.id, itemName, quantity, handlers.addToListComplete);
    },
    // Called after adding the item completes
    addToListComplete: function(result) {
        if (result.success) {
            console.log("Successfully added to list.");
        } else {
            console.log("Unable to add to list: "+result.error);
        }
    }
}

// Authenticate
client.authenticate(username, password, handlers.authComplete);
```

