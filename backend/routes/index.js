const express = require("express");
const router = express.Router();
const login = require("../controllers/login/login.controller");
const user = require("../controllers/user/index");
const { discussion } = require("../models/discussion_model");

router.use("/login", login);
router.use("/user", user);
router.use("/discussion", discussion);

module.exports = router;
