const express = require("express");
const user = express.Router();
const userController = require("./user_controller");
const tokenAccessVerification = require("../../services/token-access-verification.service");

user.post(
	"/create_user",
	userController.createUser
);

user.post(
	"/delete_user",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	userController.deleteUser
);

user.post(
	"/update_user",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	userController.updateUser
);

user.post(
	"/get_users_list",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	userController.getUsersList
);

user.post(
	"/search_user",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	userController.searchUser
);

user.post(
	"/follow_user/:user_id",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	userController.followUser
);




module.exports = user;
