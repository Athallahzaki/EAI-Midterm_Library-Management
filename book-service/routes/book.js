const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");

let books = [];

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  auth,
  authorize({ roles: ["admin"], services: ["borrow-service"] }),
  (req, res) => {
    const book = {
      id: Date.now().toString(),
      ...req.body,
    };

    books.push(book);
    res.status(201).json(book);
  }
);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 */
router.get("/", (req, res) => {
  res.json(books);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 */
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.sendStatus(404);
  res.json(book);
});

module.exports = router;