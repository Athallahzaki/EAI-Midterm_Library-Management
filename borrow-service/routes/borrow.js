const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const controller = require("../controllers/borrow.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowRequest:
 *       type: object
 *       required:
 *         - book_id
 *       properties:
 *         book_id:
 *           type: string
 *           description: The ID of the book to borrow
 *       example:
 *         book_id: "book_abc_123"
 *
 *     BorrowRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         book_id:
 *           type: string
 *         status:
 *           type: string
 *           enum: [borrowed, returned]
 *         borrow_date:
 *           type: string
 *           format: date-time
 *         return_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         user:
 *           $ref: '#/components/schemas/User'
 *         book:
 *           $ref: '#/components/schemas/Book'
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 */

/**
 * @swagger
 * /borrow:
 *   post:
 *     summary: User borrows a book
 *     tags: [Borrow]
 *     security:
 *       - userAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowRequest'
 *     responses:
 *       201:
 *         description: Borrow record created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: book_id required or book out of stock
 */
router.post(
  "/",
  auth,
  authorize({ roles: ["all"] }),
  controller.borrowBook
);

/**
 * @swagger
 * /borrow/{id}/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrow]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The borrow record ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowRecord'
 *       403:
 *         description: Forbidden (trying to return someone else's borrow)
 *       404:
 *         description: Borrow record not found
 */
router.post(
  "/:id/return",
  auth,
  authorize({ roles: ["all"] }),
  controller.returnBook
);

/**
 * @swagger
 * /borrow:
 *   get:
 *     summary: Get all borrow records (Admin Only)
 *     tags: [Borrow]
 *     security:
 *       - userAuth: []
 *     responses:
 *       200:
 *         description: List of all borrows with user and book details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowRecord'
 */
router.get(
  "/",
  auth,
  authorize({ roles: ["admin"] }),
  controller.getAllBorrows
);

/**
 * @swagger
 * /borrow/me:
 *   get:
 *     summary: Get current user's borrow history
 *     tags: [Borrow]
 *     security:
 *       - userAuth: []
 *     responses:
 *       200:
 *         description: Personal borrow history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowRecord'
 */
router.get(
  "/me",
  auth,
  authorize({ roles: ["all"] }),
  controller.getMyBorrows
);

module.exports = router;