const jwt = require("jsonwebtoken");

const SERVICE_SECRET = process.env.SERVICE_JWT_SECRET;

function generateServiceToken() {
  return jwt.sign(
    {
      type: "service",
      service: "borrow-service",
    },
    SERVICE_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  generateServiceToken,
};