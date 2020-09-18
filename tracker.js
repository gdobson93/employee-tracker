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

let roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, answer) {
    if (err) throw err;
    for (var i = 0; i < answer.length; i++) {
      roleArr.push(answer[i].title);
    }
  });
  return roleArr;
};

let managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, answer) {
    if (err) throw err;
    for (var i = 0; i < answer.length; i++) {
      managersArr.push(answer[i].first_name);
    };
  });
  return managersArr;
};

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
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",  function(err, answer) {
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
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "Enter their first name "
    },
    {
      name: "lastname",
      type: "input",
      message: "Enter their last name "
    },
    {
      name: "role",
      type: "list",
      message: "What is their role? ",
      choices: selectRole()
    }
]).then(function (answer) {
  let roleId = selectRole().indexOf(answer.role) + 1
  connection.query("INSERT INTO employee SET ?", 
  {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: roleId
      
  }, function(err){
      if (err) throw err
      console.table(answer)
      startPrompt()
    });
  });
};

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

function updateEmployees() {
  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, answer) {

     if (err) throw err
     console.log(answer)
    inquirer.prompt([
          {
            name: "lastName",
            type: "list",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < answer.length; i++) {
                lastName.push(answer[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "list",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then(function(answer) {
        let roleId = selectRole().indexOf(answer.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: answer.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err;
            console.table(answer);
            startPrompt()
        });
    });
  });
};
