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

    if (!emailNew || !password || !username ||!first_name || !last_name) {
      throw {status: 400, message: "username, first_name, last_name, email, password required" };
    }

    const existing = await usersData.getUserByEmail(emailNew);
    if (existing) throw {status: 409, message: "Email already exists" };

    const password_hash = await bcrypt.hash(password, 10);

    const user = await usersData.createUser({
      username,
      first_name,
      last_name,
      email: emailNew,
      password_hash,
      phone_number: phone_number || null,
      role: role || "user",
      is_active: is_active ?? true,
    });

    res.status(201).json(sanitize(user));
  } catch (err) {
    handleError(err, res);
  }
}

// GET /users (admin)
async function getAllUsers(req, res) {
  try {
    const users = await usersData.getAllUsers();
    res.json(users.map(sanitize));
  } catch (err) {
    handleError(err, res);
  }
}


// GET /users/batch?ids=1,2,3
async function getUsersByIds(req, res) {
  try {
    const ids = req.query.ids?.split(",") || [];

    if (ids.length === 0) return res.json([]);

    const users = await usersData.getUsersByIds(ids);

    res.json(users);
  } catch (err) {
    handleError(err, res);
  }
}

// GET /users/me
async function getCurrentUser(req, res) {
  try {
    const user = await usersData.getUserById(req.user.id);

    if (!user) throw { status: 404, message: "User not found" };

    res.json(sanitize(user));
  } catch (err) {
    handleError(err, res);
  }
}

// GET /users/email/:email (admin)
async function getUserByEmail(req, res) {
  try {
    const email = req.query.email.toLowerCase();
    const user = await usersData.getUserByEmail(email);

    if (!user) throw { status: 404, message: "Email not found" };

    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
}

// GET /users/:id (admin)
async function getUserById(req, res) {
  try {
    const user = await usersData.getUserById(req.params.id);

    if (!user) throw { status: 404, message: "User not found" };

    res.json(sanitize(user));
  } catch (err) {
    handleError(err, res);
  }
}

// PATCH /users/:id (admin)
async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const email = req.body.email?.toLowerCase();

    const existing = await usersData.getUserById(id);
    if (!existing) throw { status: 404, message: "User not found" };

    if (email) {
      const existing_email = await usersData.getUserByEmail(email);

      if (existing_email && existing_email.id !== id) {
        throw { status: 409, message: "Email already exists" };
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
    handleError(err, res);
  }
}

// DELETE /users/:id (admin)
async function deleteUser(req, res) {
  try {
    const id = req.params.id;

    const existing = await usersData.getUserById(id);
    if (!existing) throw { status: 404, message: "User not found" };

    await usersData.deleteUser(id);

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err, res) {
  const status = err.status || err.response?.status || 500;
  
  const message = err.response?.data?.message || err.message || "Internal Server Error";

  if (status === 500) console.error(err);
  return res.status(status).json({ message });
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