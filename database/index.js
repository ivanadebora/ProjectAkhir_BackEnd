const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'idw',
    password: 'vandeb0703',
    database: 'travelID',
    port: 3306
});

module.exports = conn;