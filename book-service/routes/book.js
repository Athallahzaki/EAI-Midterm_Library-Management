const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const controller = require("../controllers/books.controller");

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create book
 *     tags: [Books]
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
 *     summary: Get all books
 *     tags: [Books]
 */
router.get("/", controller.getAllBooks);

/**
 * @swagger
 * /books/batch:
 *   get:
 *     summary: Get book data in batch
 *     tags: [Books]
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
 *     summary: Get book by ID
 *     tags: [Books]
 */
router.get("/:id", controller.getBookById);

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Update book
 *     tags: [Books]
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
 *     summary: Delete book
 *     tags: [Books]
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
 *     summary: Borrow a book (Decrease available count)
 *     tags: [Books]
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
 *     summary: Return a book (Increase available count)
 *     tags: [Books]
 */
router.post(
  "/:id/return",
  auth,
  authorize({ services: ["borrow-service"] }),
  controller.returnBook
);

module.exports = router;