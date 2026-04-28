const express = require("express");
const router = express.Router();

router.use("/borrow", require("./borrow"));

module.exports = router;