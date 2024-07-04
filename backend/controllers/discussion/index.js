const express = require("express");
const discussion = express.Router();
const discussionController = require("./discussion_controller");
const tokenAccessVerification = require("../../services/token-access-verification.service");

discussion.post(
	"/create_discussion",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.createDiscussion
);

discussion.post(
	"/delete_discussion",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.deleteDiscussion
);

discussion.post(
	"/update_discussion",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.updateDiscussion
);

discussion.post(
	"/get_discussions_list_by_tag",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.getDiscussionByTag
);

discussion.post(
	"/search_discussion_by_text",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.getDiscussionByText
);

discussion.post(
	"/view_post/:discussion_id",
	(req, res, next) =>
		tokenAccessVerification.tokenAccessVerification(req, res, next),
	discussionController.incrementViewCount
);




module.exports = discussion;
