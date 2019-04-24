// var mysql      = require('mysql');
// var connection = mysql.createConnection({
module.exports = {
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  port     : '3306',
  database : 'internote'
};

// connection.connect();
//
// connection.query('SELECT from member where id=admin', function(err, rows, fields) {
//   if (!err)
//     console.log('The solution is: ', rows);
//   else
//     console.log('Error while performing Query.', err);
// });
//
// connection.end();
