const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const controller = require("../controllers/books.controller");
/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         isbn:
 *           type: string
 *           nullable: true
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         publisher:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         cover_url:
 *           type: string
 *           nullable: true
 *         total_count:
 *           type: integer
 *           default: 1
 *         available_count:
 *           type: integer
 *       example:
 *         id: "60d0fe4f5311236168a109ca"
 *         isbn: "978-3-16-148410-0"
 *         title: "The Great Gatsby"
 *         author: "F. Scott Fitzgerald"
 *         publisher: "Scribner"
 *         description: "A novel set in the Jazz Age."
 *         cover_url: "http://example.com/cover.jpg"
 *         total_count: 5
 *         available_count: 5
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book (Admin/Borrow Service Only)
 *     tags: [Books]
 *     security:
 *       - userAuth: []
 *       - serviceAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input or missing required fields
 */
router.post(
  "/",
  auth,
  authorize({ roles: ["admin"], services: ["borrow-service"] }),
  controller.createBook
);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/", controller.getAllBooks);

/**
 * @swagger
 * /books/batch:
 *   get:
 *     summary: Get book data in batch by IDs (Internal Only)
 *     tags: [Books]
 *     security:
 *       - serviceAuth: []
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma-separated list of book IDs (e.g., 1,2,3)
 *     responses:
 *       200:
 *         description: List of books matching the IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get(
  "/batch",
  auth,
  authorize({ services: ["borrow-service"] }),
  controller.getBooksByIds
);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.get("/:id", controller.getBookById);

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Update the book by the id (Admin Only)
 *     tags: [Books]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *       400:
 *         description: Validation error
 */
router.patch(
  "/:id",
  auth,
  authorize({ roles: ["admin"] }),
  controller.updateBook
);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove the book by id (Admin Only)
 *     tags: [Books]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       204:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */
router.delete(
  "/:id",
  auth,
  authorize({ roles: ["admin"] }),
  controller.deleteBook
);

/**
 * @swagger
 * /books/{id}/borrow:
 *   post:
 *     summary: Borrow a book (decreases available count, Internal Only)
 *     tags: [Books]
 *     security:
 *       - serviceAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: Successfully borrowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: No available copies
 *       404:
 *         description: Book not found
 */
router.post(
  "/:id/borrow",
  auth,
  authorize({ services: ["borrow-service"] }),
  controller.borrowBook
);

/**
 * @swagger
 * /books/{id}/return:
 *   post:
 *     summary: Return a book (increases available count, Internal Only)
 *     tags: [Books]
 *     security:
 *       - serviceAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: Successfully returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Capacity already at max
 *       404:
 *         description: Book not found
 */
router.post(
  "/:id/return",
  auth,
  authorize({ services: ["borrow-service"] }),
  controller.returnBook
);

module.exports = router;