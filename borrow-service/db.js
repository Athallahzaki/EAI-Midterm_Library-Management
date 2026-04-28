const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.BORROW_SERVICE_DB_URL);

module.exports = pool;