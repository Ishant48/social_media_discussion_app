const express = require("express");
const comment = express.Router();
const commentController = require("./comment_controller");
const tokenAccessVerification = require("../../services/token-access-verification.service");

comment.post(
	"/create_comment",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.createcomment
);

comment.post(
	"/delete_comment",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.deletecomment
);

comment.post(
	"/update_comment",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.updatecomment
);

comment.post(
	"/get_comments_list_by_tag",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.getcommentByTag
);

comment.post(
	"/search_comment_by_text",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.getcommentByText
);




module.exports = comment;
