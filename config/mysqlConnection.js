var mysql = require('mysql');
var connectionJson = require('./mysqlConnection.json');


// console.log(connectionJson.db)
var connection = mysql.createConnection(connectionJson.db);



module.exports = connection;