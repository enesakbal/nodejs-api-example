const mysql = require('mysql');
const mysql_config = require('../../config/mysql_config');

//create mysql connection pool
var dbconnection = mysql.createPool(
    mysql_config
);

// Attempt to catch disconnects 
dbconnection.on('connection', function (connection) {
    console.log('DB Connection established');

});

module.exports = dbconnection;
 