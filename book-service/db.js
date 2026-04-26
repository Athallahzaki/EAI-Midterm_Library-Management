const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.BOOK_SERVICE_DB_URL);

module.exports = pool;