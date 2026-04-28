const db = require("../db");

async function createBook({
  isbn,
  title,
  author,
  publisher,
  description,
  cover_url,
  total_count,
  available_count,
}) {
  const [result] = await db.execute(
    `INSERT INTO books 
    (isbn, title, author, publisher, description, cover_url, total_count, available_count) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [isbn, title, author, publisher, description, cover_url, total_count, available_count]
  );

  return getBookById(result.insertId);
}

async function getAllBooks() {
  const [rows] = await db.execute(
    `SELECT id, isbn, title, author, publisher, description, cover_url, total_count, available_count 
     FROM books`
  );
  return rows;
}

async function getBookById(id) {
  const [rows] = await db.execute(
    `SELECT id, isbn, title, author, publisher, description, cover_url, total_count, available_count 
     FROM books WHERE id = ?`,
    [id]
  );

  return rows[0];
}

async function getBooksByIds(ids) {
  const placeholders = ids.map(() => "?").join(",");

  const [rows] = await db.execute(
    `SELECT id, isbn, title, author, publisher, cover_url FROM books WHERE id IN (${placeholders})`,
    ids
  );

  return rows;
}

async function updateBook(id, {
  isbn,
  title,
  author,
  publisher,
  description,
  cover_url,
  total_count,
  available_count,
}) {
  await db.execute(
    `UPDATE books SET 
      isbn = ?,
      title = ?, 
      author = ?, 
      publisher = ?, 
      description = ?,
      cover_url = ?, 
      total_count = ?, 
      available_count = ?
     WHERE id = ?`,
    [isbn, title, author, publisher, description, cover_url, total_count, available_count, id]
  );

  return getBookById(id);
}

async function deleteBook(id) {
  await db.execute("DELETE FROM books WHERE id = ?", [id]);
}

module.exports = {
  createBook,
  getAllBooks,
  getBooksByIds,
  getBookById,
  updateBook,
  deleteBook,
};