const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345678",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;

  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What action would you like to do?",
      choices: [
        "Add Department",
        "Add Roles",
        "Add Employees",
        "View Department",
        "View Roles",
        "View Employees",
        "Update Employees",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Add Department":
        addDept();
        break;

      case "Add Roles":
        addRoles();
        break;

      case "Add Employees":
        addEmployees();
        break;

      case "View Department":
        viewDept();
        break;

      case "View Roles":
        viewRoles();
        break;

      case "View Employees":
        viewEmployees();
        break;

      case "Update Employees":
        updateEmployees();
        break;

      default:
        connection.end();
        break;
      }
    });
});

// will need some inquirer prompts

// Add departments, roles, employees

function addDept() {
  
};

function addRoles() {

};

function addEmployees() {

};

//View departments, roles, employees

function viewDept() {

};

function viewRoles() {

};

function viewEmployees() {

};
//Update employee roles

function updateEmployees() {

};