const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const controller = require("../controllers/borrow.controller");

/**
 * POST /borrow
 * User borrows a book
 */
router.post(
  "/",
  auth,
  authorize({ roles: ["all"] }),
  controller.borrowBook
);

/**
 * POST /borrow/:id/return
 */
router.post(
  "/:id/return",
  auth,
  authorize({ roles: ["all"] }),
  controller.returnBook
);

/**
 * GET /borrow (admin only)
 */
router.get(
  "/",
  auth,
  authorize({ roles: ["admin"] }),
  controller.getAllBorrows
);

/**
 * GET /borrow/me
 */
router.get(
  "/me",
  auth,
  authorize({ roles: ["all"] }),
  controller.getMyBorrows
);

module.exports = router;