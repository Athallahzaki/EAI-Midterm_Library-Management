const db = require("../db");

async function createBorrow({ user_id, book_id }) {
  const [result] = await db.execute(
    `INSERT INTO borrows (user_id, book_id, status)
     VALUES (?, ?, 'borrowed')`,
    [user_id, book_id]
  );

  return getBorrowById(result.insertId);
}

async function getBorrowById(id) {
  const [rows] = await db.execute(
    `SELECT * FROM borrows WHERE id = ?`,
    [id]
  );
  return rows[0];
}

async function getAllBorrows() {
  const [rows] = await db.execute(
    `SELECT * FROM borrows`
  );
  return rows;
}

async function getBorrowsByUser(user_id) {
  const [rows] = await db.execute(
    `SELECT * FROM borrows WHERE user_id = ?`,
    [user_id]
  );
  return rows;
}

async function returnBorrow(id) {
  await db.execute(
    `UPDATE borrows 
     SET status = 'returned', returned_at = NOW()
     WHERE id = ?`,
    [id]
  );

  return getBorrowById(id);
}

module.exports = {
  createBorrow,
  getBorrowById,
  getAllBorrows,
  getBorrowsByUser,
  returnBorrow,
};