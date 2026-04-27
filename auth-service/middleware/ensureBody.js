// middleware/ensureBody.js
function ensureBody(req, res, next) {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (req.body === undefined) {
      req.body = {};
    }
  }
  next();
}

module.exports = ensureBody;