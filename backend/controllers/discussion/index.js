const express = require("express");
const discussion = express.Router();
const discussionController = require("./discussion_controller");
const tokenAccessVerification = require("../../services/token-access-verification.service");

discussion.post(
	"/create_discussion",
	discussionController.creatediscussion
);

discussion.post(
	"/delete_discussion",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.deletediscussion
);

discussion.post(
	"/update_discussion",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.updatediscussion
);

discussion.post(
	"/get_discussions_list",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.getdiscussionsList
);

discussion.post(
	"/search_discussion",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.searchdiscussion
);




module.exports = discussion;
