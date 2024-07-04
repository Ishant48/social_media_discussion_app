const express = require("express");
const router = express.Router();
const login = require("../controllers/login/login.controller");
const user = require("../controllers/user/index");
const discussion = require("../controllers/discussion/index");
const comment = require("../controllers/comment/index");

router.use("/login", login);
router.use("/user", user);
router.use("/discussion", discussion);
router.use("/comment",comment)

module.exports = router;
