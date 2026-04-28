const db = require("../db");

async function createUser({ username, first_name, last_name, email, password_hash, phone_number, role, is_active }) {
  const [result] = await db.execute(
    "INSERT INTO users (username, first_name, last_name, email, password_hash, phone_number, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [username, first_name, last_name, email, password_hash, phone_number, role, is_active]
  );

  return getUserById(result.insertId);
}

async function getAllUsers() {
  const [rows] = await db.execute(
    "SELECT id, username, first_name, last_name, email, phone_number, role, is_active FROM users"
  );
  return rows;
}

async function getUserById(id) {
  const [rows] = await db.execute(
    "SELECT id, username, first_name, last_name, email, password_hash, phone_number, role, is_active FROM users WHERE id = ?",
    [id]
  );

  return rows[0];
}

async function getUsersByIds(ids) {
  const placeholders = ids.map(() => "?").join(",");
  const [rows] = await db.execute(
      `SELECT id, username, email, role FROM users WHERE id IN (${placeholders})`,
      ids
    );

  return rows;
}

async function getUserByEmail(email) {
  const [rows] = await db.execute(
    "SELECT id, username, first_name, last_name, email, password_hash, phone_number, role, is_active FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
}

async function updateUser(id, { username, first_name, last_name, email, password_hash, phone_number, is_active }) {
  await db.execute(
    "UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ?, password_hash = ?, phone_number = ?, is_active = ? WHERE id = ?",
    [username, first_name, last_name, email, password_hash, phone_number, is_active, id]
  );

  return getUserById(id);
}

async function deleteUser(id) {
  await db.execute(
    "DELETE FROM users WHERE id = ?",
    [id]
  );
}

module.exports = {
  createUser,
  getAllUsers,
  getUsersByIds,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};