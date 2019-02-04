var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');

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
  getItems();
});

function getItems (){
  let config,
    data,
    output;

  data = [["ID","Product Name","Department","Price","Quantity","Product Sales"]];

  connection.query(`SELECT * FROM products;`, function (err, res) {
    if (err) throw err;
    for(var i in res){
      data.push([res[i].item_id,res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity,res[i].product_sales]);
    }
    output = table(data);
    console.log(output);
    init();
  });
}

function init() {

  inquirer.prompt([
    {
      type: "input",
      message: "What would you like to buy (itemID)?",
      name: "itemID"
    },
    {
      type: "input",
      message: "How many?",
      name: "amt"
    }

  ])
    .then(answers => {
      var id = Number(answers.itemID);
      var amt = Number(answers.amt);
      connection.query(`SELECT * FROM products WHERE item_id = ?;`,[id], function (err, res) {
        if (err) throw err;
        //console.log(res);
        if(res.length != 0){
          var remainingValue = res[0].stock_quantity - amt;
          if( remainingValue >= 0){
            updateAmt(remainingValue,id);
            getItems();
          }else {
            console.log("There isn't enough in stock, sorry.");
            init();
          }
        }else{
          console.log("No item with that ID");
          init();
        };

      });
    });
}

function updateAmt (remainingValue, id){
  connection.query(`UPDATE products SET stock_quantity = ? WHERE item_id = ?`,[remainingValue,id], function (err, res) {
    if (err) throw err;
    console.log("Processing..")
    console.log("Complete!");
  });
}