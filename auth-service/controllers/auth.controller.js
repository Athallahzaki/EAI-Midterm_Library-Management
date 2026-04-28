const axios = require("axios");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwt");
const urlUtil = require("../utils/url");

const USER_SERVICE_URL = urlUtil.serviceUrl("USER_SERVICE");

// POST /auth/register
async function register(req, res) {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      password,
      phone_number,
    } = req.body;

    if (!email || !password || !username ||!first_name || !last_name) {
      throw { status: 400, message: "username, first_name, last_name, email, password required" };
    }

    const response = await axios.post(
      `${USER_SERVICE_URL}/users`,
      {
        username,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        role: "user",
      },
      {
        headers: {
          Authorization: `Bearer ${jwtUtil.generateServiceToken()}`,
        },
      }
    );

    res.status(201).json(response.data);
  } catch (err) {
    handleError(err, res);
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const response = await axios.get(
      `${USER_SERVICE_URL}/users/email?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${jwtUtil.generateServiceToken()}`,
        },
      }
    ).catch(function (error) {
      if (error.response?.status === 404) throw { status: 401, message: "Invalid credentials" }
    });

    const user = response.data;

    if (!user) throw { status: 401, message: "Invalid credentials" }

    if (!user.is_active) throw { status: 403, message: "User inactive" }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) throw { status: 401, message: "Invalid credentials" }

    const token = jwtUtil.signUser(user);

    res.json({ token });
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
  register,
  login,
};