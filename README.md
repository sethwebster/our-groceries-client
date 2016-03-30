# Our Groceries Client

Current Features
 * Provides Authentication
 * Allows Retrieval of User's grocery lists
 * Allows addition of items to lists

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
    authComplete: function(result) {
        if (result.success) {
            client.getLists(handlers.getListsComplete);
        } else {
            console.log("Authentication Failed: "+result.error);
        }
    },
    getListsComplete: function(result) {
        if (result.success) {
            var list = client.getList(result.response.shoppingLists, listName);
            if (list) {
                client.addToList(list.id, itemName, quantity, handlers.addToListComplete);
            } else {
                console.log("Unable to find list: "+listName);
            }
        } else {
            console.log("Unable to get lists: "+result.error);
        }
    },
    addToListComplete: function(result) {
        if (result.success) {
            console.log("Successfully added to list.");
        } else {
            console.log("Unable to add to list: "+result.error);
        }
    }
}

client.authenticate(username, password, handlers.authComplete);
```

