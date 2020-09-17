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
  startPrompt();
});

function startPrompt() {
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
}

// will need some inquirer prompts

// Add departments, roles, employees

function addDept() {
  inquirer
    .prompt({
      name: "departmentName",
      type: "input",
      message: "What department do you want to add?"
    })
    .then(function(answer) {
      
      let query = connection.query("INSERT INTO department SET ? ", 
        {
          name: answer.name
        },
        function(err) {
          if (err) throw err;
          console.table(answer);
          startPrompt();
        });
    });
};

function addRoles() {
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, answer) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        } 
    ]).then(function(answer) {
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.Title,
              salary: answer.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(answer);
                startPrompt();
            }
        )

    });
  });
};

function addEmployees() {
  inquirer
    .prompt({
      name: "employeeName",
      type: "input",
      message: "What employee do you want to add?"
    })
    .then(function(answer) {
      const userInput = answer.employeeName
      let query = "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?)";
      connection.query(query, userInput, function(err, res) {
        if (err) throw err;
        //viewEmployees();
      });
    });
};

//View departments, roles, employees
// won't have inquirer 
//look at LEFT JOINs

//not working
function viewDept() {
  connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
  
  function(err, answer) {
    if (err) throw err;
    console.table(answer);
    startPrompt();
  })
};


function viewRoles() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
  
  function(err, answer) {
  if (err) throw err;
  console.table(answer);
  startPrompt();
  })

};

function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    
    function(err, answer) {
      if (err) throw err;
      console.table(answer);
      startPrompt();
  });
};
//Update employee roles

function updateEmployees() {

};
