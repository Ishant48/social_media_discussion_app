const express = require("express");
const comment = express.Router();
const commentController = require("./comment_controller");
const tokenAccessVerification = require("../../services/token-access-verification.service");

comment.post(
	"/create_comment",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.createComment
);

comment.post(
	"/like_comment",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.likeComments
);

comment.post(
	"/modify_comment",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.modifyComment
);

comment.post(
	"/delete_comment",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.deleteComment
);


comment.post(
	"/reply_comment",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	commentController.replyComment
);





module.exports = comment;
