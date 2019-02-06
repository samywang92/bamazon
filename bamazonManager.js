var mysql = require("mysql");
var inquirer = require("inquirer");
const { table } = require('table');

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    getMenu();
});

function getMenu() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "menu"
    }
    ]).then(answers => {
        switch (answers.menu) {
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
            default:
                console.log("Seems like something went wrong...")
                getMenu();
                break;
        }
    });

}

function viewProducts() {
    let data, output;

    data = [["ID", "Product Name", "Department", "Price", "Quantity", "Product Sales"]];

    connection.query(`SELECT * FROM products;`, function (err, res) {
        if (err) throw err;
        for (var i in res) {
            data.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales]);
        }
        output = table(data);
        console.log(output);
        getMenu();
    });
}

function viewLowInventory() {
    let data, output;

    data = [["ID", "Product Name", "Department", "Price", "Quantity", "Product Sales"]];

    connection.query(`SELECT * FROM products WHERE stock_quantity < 5;`, function (err, res) {
        if (err) throw err;
        for (var i in res) {
            data.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales]);
        }
        output = table(data);
        console.log(output);
        getMenu();
    });
}

function addToInventory() {
    let data, output;

    data = [["ID", "Product Name", "Department", "Price", "Quantity", "Product Sales"]];

    connection.query(`SELECT * FROM products;`, function (err, res) {
        if (err) throw err;
        for (var i in res) {
            data.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales]);
        }
        output = table(data);
        //console.log(data);
        console.log(output);

        inquirer.prompt([
            {
                type: "input",
                message: "What item would you like to restock (itemID)?",
                name: "itemID"
            },
            {
                type: "input",
                message: "How many?",
                name: "amt"
            }
        ]).then(answers => {
            var exists = false;
            var id = Number(answers.itemID);
            var amt = Number(answers.amt);
            var temp;
            for (var i in data) {
                if (data[i][0] === id) { // checks if inputted ID exists in the DB
                    exists = true;
                    temp = i;
                }
            }
            if (exists) {
                amt += data[temp][4]; // adds to the original quantity value in the DB
                connection.query(`UPDATE products SET stock_quantity = ? WHERE item_id = ?`, [amt, id], function (err, res) {
                    if (err) throw err;
                    console.log("Updating...");
                    console.log("Complete!");
                    getMenu();
                });
            } else {
                console.log("The item does not exists, please add new product or check your item ID.");
                getMenu();
            }
        });

    });

}

function addNewProduct() {
    inquirer.prompt([{
        type: "input",
        message: "What is the product's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What department does this product belong to?",
        name: "dept"
    },
    {
        type: "input",
        message: "How much would it cost?",
        name: "price"
    },
    {
        type: "input",
        message: "How many?",
        name: "amt"
    }
    ]).then(answers => {
        connection.query(`INSERT INTO products(product_name, department_name, price, stock_quantity)
        VALUES (?, ?, ?, ?);`, [answers.name, answers.dept, Number(answers.price), Number(answers.amt)], function (err, res) {
            if (err) throw err;
            console.log("Adding...");
            console.log("Complete!");
            getMenu();
        });
    });
}