const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");

let users = [];

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  auth,
  authorize({ roles: ["admin"], services: ["auth-service"] }),
  (req, res) => {
    const user = {
      id: Date.now().toString(),
      ...req.body,
    };

    users.push(user);
    res.status(201).json(user);
  }
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 */
router.get("/", (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 */
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.sendStatus(404);
  res.json(user);
});

module.exports = router;