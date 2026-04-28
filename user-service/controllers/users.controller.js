const usersData = require("../data/users.data");
const bcrypt = require("bcrypt");

// helper to remove password before sending response
function sanitize(user) {
  if (!user) return user;
  const { password_hash, ...safe } = user;
  return safe;
}

// POST /users
async function createUser(req, res) {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      password,
      phone_number,
      role,
      is_active,
    } = req.body;

    const emailNew = email.toLowerCase();

    if (!emailNew || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existing = await usersData.getUserByEmail(emailNew);
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await usersData.createUser({
      username,
      first_name,
      last_name,
      email: emailNew,
      password_hash,
      phone_number,
      role: role || "user",
      is_active: is_active ?? true,
    });

    res.status(201).json(sanitize(user));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// GET /users (admin)
async function getAllUsers(req, res) {
  try {
    const users = await usersData.getAllUsers();
    res.json(users.map(sanitize));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}


// GET /users?ids=1,2,3
async function getUsersByIds(req, res) {
  try {
    const ids = req.query.ids?.split(",") || [];

    if (ids.length === 0) return res.json([]);

    const placeholders = ids.map(() => "?").join(",");

    const [rows] = await db.execute(
      `SELECT id, username, email, role FROM users WHERE id IN (${placeholders})`,
      ids
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// GET /users/me
async function getCurrentUser(req, res) {
  try {
    const user = await usersData.getUserById(req.user.id);

    if (!user) return res.sendStatus(404);

    res.json(sanitize(user));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// GET /users/email/:email (admin)
async function getUserByEmail(req, res) {
  try {
    const email = toLowerCase(req.query.email);
    const user = await usersData.getUserByEmail(email);

    if (!user) return res.sendStatus(404);

    res.json(user);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// GET /users/:id (admin)
async function getUserById(req, res) {
  try {
    const user = await usersData.getUserById(req.params.id);

    if (!user) return res.sendStatus(404);

    res.json(sanitize(user));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// PATCH /users/:id (admin)
async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const email = toLowerCase(req.body.email);

    const existing = await usersData.getUserById(id);
    if (!existing) return res.sendStatus(404);

    if (email) {
      const existing_email = await usersData.getUserByEmail(email);

      if (existing_email && existing_email.id !== id) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    let password_hash = existing.password_hash;

    if (req.body.password) {
      password_hash = await bcrypt.hash(req.body.password, 10);
    }

    const updated = {
      username: req.body.username ?? existing.username,
      first_name: req.body.first_name ?? existing.first_name,
      last_name: req.body.last_name ?? existing.last_name,
      email: email ?? existing.email,
      password_hash,
      phone_number: req.body.phone_number ?? existing.phone_number,
      is_active: req.body.is_active ?? existing.is_active,
    };

    const user = await usersData.updateUser(id, updated);

    res.json(sanitize(user));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// DELETE /users/:id (admin)
async function deleteUser(req, res) {
  try {
    const id = req.params.id;

    const existing = await usersData.getUserById(id);
    if (!existing) return res.sendStatus(404);

    await usersData.deleteUser(id);

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUsersByIds,
  getCurrentUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};