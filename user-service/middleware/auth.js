const jwt = require("jsonwebtoken");

const USER_SECRET = process.env.USER_JWT_SECRET;
const SERVICE_SECRET = process.env.SERVICE_JWT_SECRET;

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  if (!header.startsWith("Bearer ")) return res.sendStatus(401);

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.type) {
      return res.sendStatus(401);
    }

    let verified;

    if (decoded.type === "user") {
      verified = jwt.verify(token, USER_SECRET);
      req.user = { ...verified, type: "user" };
    } else if (decoded.type === "service") {
      verified = jwt.verify(token, SERVICE_SECRET);
      req.user = { ...verified, type: "service" };
    } else {
      return res.sendStatus(401);
    }

    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

function authorize({ roles = [], services = [] }) {
  return (req, res, next) => {
    const user = req.user;

    if (user.type === "user") {
      if (roles.length === 0 || roles.includes(user.role)) {
        return next();
      }
    }

    if (user.type === "service") {
      if (services.length === 0 || services.includes(user.service)) {
        return next();
      }
    }

    return res.status(403).json({ message: "Forbidden" });
  };
}

module.exports = { auth, authorize };