# bamazon
This application is a bare bone version of Amazon.
Allows 2 views: Customer and Manager

# Custmer View
![custumer_view](/images/cust_view.png)

In this view, a customer is able to see a table of items.  The customer can then pick an item to buy based off of ID and select how many the customer would like.

It pulls data from a SQL database.  If the amount is greater than the quantity available in stock, it will tell the user.

# Manager View
In this view, the manager gets to select 4 different tasks: View Products for Sale, View Low Inventory, Add to Inventory, and Add New Products.

![custumer_view](/images/view_prod.png)
Like the custumer view, the manager is able to view products in the inventory.

![custumer_view](/images/view_low.png)
The manager is able to view items that are low in inventory (below 5).

![custumer_view](/images/update.png)
The manager is able to update items in the inventory.  If the item does not exist, it will let the user know.

![custumer_view](/images/up.png)
The manager is able to add a new item to the inventory.