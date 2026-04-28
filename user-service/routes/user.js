const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const controller = require("../controllers/users.controller");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", auth, authorize({ roles: ["admin"], services: ["auth-service"] }), controller.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 */
router.get("/", auth, authorize({ roles: ["admin"], services: ["auth-service"] }), controller.getAllUsers);

/**
 * @swagger
 * /users/batch:
 *   get:
 *     summary: Get user data in batch
 *     tags: [Users]
 */
router.get(
  "/batch",
  auth,
  authorize({ services: ["borrow-service"] }),
  controller.getUsersByIds
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", auth, controller.getCurrentUser);

/**
 * @swagger
 * /users/email:
 *   get:
 *     summary: Get user by Email
 *     parameters:
 *      - in: query
 *        name: email
 *        required: true
 *        schema:
 *         type: string
 *     tags: [Users]
 */
router.get("/email", auth, authorize({ services: ["auth-service"] }), controller.getUserByEmail);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 */
router.get("/:id", auth, authorize({ roles: ["admin"], services: ["auth-service"] }), controller.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 */
router.patch("/:id", auth, authorize({ roles: ["admin"]}), controller.updateUser);


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 */
router.delete("/:id", auth, authorize({ roles: ["admin"]}), controller.deleteUser);

module.exports = router;