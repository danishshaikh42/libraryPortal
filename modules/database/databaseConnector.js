var mysql = require('mysql');
var config = require('./../../config');

var con = mysql.createConnection({
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseDatabaseName,
    multipleStatements: true
});

myFunction();

function myFunction() {
    setTimeout(function () {
        con.connect(function (err) {
            if (err) {
                console.log('Error connecting to Database');
                return;
            }

            console.log("Started iteration on - " + new Date());
            console.log("Connection established");
        });
    }, 3000);
}

module.exports = con;