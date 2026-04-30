const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

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
 *     AuthRegister:
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
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "StrongPassword123!"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT Access Token for User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Public endpoint to create a user account. Internally calls User Service.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error (missing fields)
 *       409:
 *         description: Email already registered
 */
router.post("/register", controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Verify credentials and receive a User JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account is inactive
 */
router.post("/login", controller.login);

module.exports = router;