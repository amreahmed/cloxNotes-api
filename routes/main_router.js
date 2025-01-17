const express = require("express");
const auth = require("./auth/index");
const notes = require("./notes/index");

const router = express.Router();


router.use("/auth", auth);
router.use("/notes", notes);

module.exports = router;
