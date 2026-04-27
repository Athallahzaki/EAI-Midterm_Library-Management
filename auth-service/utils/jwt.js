const jwt = require("jsonwebtoken");

const USER_SECRET = process.env.USER_JWT_SECRET;
const SERVICE_SECRET = process.env.SERVICE_JWT_SECRET;

function signUser(user) {
  return jwt.sign(
    {
      type: "user",
      id: user.id,
      role: user.role,
    },
    USER_SECRET,
    { expiresIn: "1h" }
  );
}

function generateServiceToken() {
  return jwt.sign(
    {
      type: "service",
      service: "auth-service",
    },
    SERVICE_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  signUser,
  generateServiceToken,
};