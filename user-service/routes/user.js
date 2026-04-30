const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const controller = require("../controllers/users.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         phone_number:
 *           type: string
 *           nullable: true
 *         role:
 *           type: string
 *         is_active:
 *           type: boolean
 *       example:
 *         id: 1
 *         username: "jdoe88"
 *         first_name: "John"
 *         last_name: "Doe"
 *         email: "john@example.com"
 *         phone_number: "087700000000"
 *         role: "user"
 *         is_active: 1
 *
 *     UserCreate:
 *       type: object
 *       required:
 *         - username
 *         - first_name
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *         phone_number:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         is_active:
 *           type: boolean
 * 
 *     UserBatch:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *       example:
 *         id: 1
 *         username: "jdoe88"
 *         email: "john@example.com"
 *         role: "user"
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     security:
 *       - userAuth: []
 *       - serviceAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already exists
 */
router.post("/", auth, authorize({ roles: ["admin"], services: ["auth-service"] }), controller.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin/Auth Service Only)
 *     tags: [Users]
 *     security:
 *       - userAuth: []
 *       - serviceAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", auth, authorize({ roles: ["admin"], services: ["auth-service"] }), controller.getAllUsers);

/**
 * @swagger
 * /users/batch:
 *   get:
 *     summary: Get user data in batch (Internal Only)
 *     tags: [Users]
 *     security:
 *       - serviceAuth: []
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated user IDs
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserBatch'
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
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - userAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get(
  "/me",
  auth,
  authorize({ roles: ["all"] }),
  controller.getCurrentUser);

/**
 * @swagger
 * /users/email:
 *   get:
 *     summary: Get user by Email (Internal Only)
 *     tags: [Users]
 *     security:
 *       - serviceAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data including hash (Internal Service use)
 *       404:
 *         description: User not found
 */
router.get("/email", auth, authorize({ services: ["auth-service"] }), controller.getUserByEmail);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin/Auth Service Only)
 *     tags: [Users]
 *     security:
 *       - userAuth: []
 *       - serviceAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/:id", auth, authorize({ roles: ["admin"], services: ["auth-service"] }), controller.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user (Admin Only)
 *     tags: [Users]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       200:
 *         description: Updated user profile
 */
router.patch("/:id", auth, authorize({ roles: ["admin"]}), controller.updateUser);


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (Admin Only)
 *     tags: [Users]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete("/:id", auth, authorize({ roles: ["admin"]}), controller.deleteUser);

module.exports = router;