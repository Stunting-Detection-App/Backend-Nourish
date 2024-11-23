const mysql = require('mysql');
/* const connection = mysql.createConnection({
    host: '34.128.99.0',
    user: 'root',
    password: '12345',
    database: 'nourish-db'
});
*/
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
      console.error('Database connection error:', err.stack);
      return;
    }
    console.log('Connected to the database.');
  });
  
  module.exports = connection;