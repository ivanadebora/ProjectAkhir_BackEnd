const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'idw',
    password: 'abc123',
    database: 'travelID',
    port: 3306
});

module.exports = conn;