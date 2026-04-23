const jwt = require("jsonwebtoken");

const USER_SECRET = process.env.USER_JWT_SECRET;
const SERVICE_SECRET = process.env.SERVICE_JWT_SECRET;

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, USER_SECRET);
    req.user = { ...decoded, type: "user" };
    return next();
  } catch {}

  try {
    const decoded = jwt.verify(token, SERVICE_SECRET);
    req.user = { ...decoded, type: "service" };
    return next();
  } catch {}

  return res.sendStatus(401);
}

function authorize({ roles = [], services = [] }) {
  return (req, res, next) => {
    const user = req.user;

    if (user.type === "user" && roles.includes(user.role)) {
      return next();
    }

    if (user.type === "service" && services.includes(user.service)) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  };
}

module.exports = { auth, authorize };