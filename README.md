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
  , listName = "Safeway"
  , itemName = "Apples";

var client = new OurGroceriesClient();

client.authenticate(username, password, function(authResult) {
	if (authResult.success) {
		client.getLists(function(listsResult) {
        	if (listsResult.success) {
            	var lists = listsResult.response.shoppingLists;
            	console.log("Retrieved " + lists.length + " lists");
                if (lists.length > 0) {               
	                client.addToList(lists[0].id, itemName, 1, function(addToListResult) {
                    	if (addToListResult.success) {
                        	console.log("Successfully added to list.");
                        } else {
                        	console.log("Error Adding to list: "+addToListResult.error);
                        }
                    });
                }
            } else {
            	console.log(listsResult.error);
            }
        });
    } else {
    	console.log("Authentication failed: "+authResult.error);
    }
});

```

