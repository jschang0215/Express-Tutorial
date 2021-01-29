var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'jschang',
  password : 'wkdwnstj0215',
  database : 'jschang',
  insecureAuth: true
});
db.connect();

module.exports = db;