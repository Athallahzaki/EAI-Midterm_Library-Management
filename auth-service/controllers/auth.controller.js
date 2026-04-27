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

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
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
    if (err.response?.status === 404) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    console.error(err.response?.data || err.message);
    res.sendStatus(500);
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
    );

    const user = response.data;

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "User inactive" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwtUtil.signUser(user);

    res.json({ token });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.error(err.response?.data || err.message);
    res.sendStatus(500);
  }
}

module.exports = {
  register,
  login,
};