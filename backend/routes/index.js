const express = require("express");
const router = express.Router();
const login = require("../controllers/login/login.controller");
const user = require("../controllers/user/index");

router.use("/login", login);
router.use("/user", user);

module.exports = router;
