const comment_db = require("../../services/database_functions/comment_db_api");
const commonFunction = require("../../services/database_functions/common_functions");
const log = require("../../services/logger");
const fileName = "comment_controller.js";

const createComment = async (req, res, next) => {
	let data = req.user;
	const functionName = "createComment";
	try {
		log.info("Creating comment and adding into the DB", {
			commentData: data,
			filename: fileName,
			method: functionName,
		});
		if (!req.body.content && !req.body.discussion_id) {
			return res.status(400).json({
				message: "Content and discussion id is nessary for creating a post.",
			});
		}
		const createObj = {
			user: data._id,
			content: req.body.content,
			discussion: req.body.discussion_id,
		};
		await comment_db.addComment(createObj);
		log.info("Successfuly added comment over the post and added into the DB", {
			commentData: data,
			filename: fileName,
			method: functionName,
		});
		return res.status(200).json({ message: "Comment added successfully" });
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while creating comment.`,
			400,
			err
		);
		next(errorResult);
	}
};

const likeComments = async (req, res, next) => {
	let data = req.user;
	const functionName = "likeComments";
	try {
		log.info("Like comment and adding into the DB", {
			filename: fileName,
			method: functionName,
		});
		if (!req.body.comment_id) {
			return res.status(400).json({
				message: "Comment id is nessary for creating a post.",
			});
		}
		let commentExists = await comment_db.findCommentById(req.body.comment_id);
		if (!commentExists) {
			return res.status(404).json({ message: "Comment not found" });
		}
		await comment_db.likeComment(commentExists, data._id);
		log.info("Successfuly like comment over the post and added into the DB", {
			commentData: data,
			filename: fileName,
			method: functionName,
		});
		return res
			.status(200)
			.json({ message: "Like added to the comment successfully" });
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while like comment.`,
			400,
			err
		);
		next(errorResult);
	}
};

const replyComment = async (req, res, next) => {
	let data = req.user;
	const functionName = "replyComment";
	try {
		log.info("Reply comment and adding into the DB", {
			filename: fileName,
			method: functionName,
		});
		if (!req.body.content && !req.body.comment_id) {
			return res.status(400).json({
				message: "Content and discussion id is nessary for creating a post.",
			});
		}
		let commentExists = await comment_db.findCommentById(req.body.comment_id);
		if (!commentExists) {
			return res.status(404).json({ message: "Comment not found" });
		}
		const replyObj = {
			user: data._id,
			content: req.body.content,
			discussion: commentExists.discussion_id,
		};
		const commentDoc = await comment_db.addComment(replyObj);
		let updateObj = { replies: { $push: commentDoc._id } };
		await comment_db.updateComment(commentExists._id,updateObj);
		log.info("Successfuly reply the comment and added into the DB", {
			commentData: data,
			filename: fileName,
			method: functionName,
		});
		return res
			.status(200)
			.json({ message: "Reply comment added successfully" });
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while creating comment.`,
			400,
			err
		);
		next(errorResult);
	}
};

const modifyComment = async (req, res, next) => {
	let data = req.user;
	const functionName = "modifyComment";
	try {
		log.info("Modify comment and adding into the DB", {
			filename: fileName,
			method: functionName,
		});
		if (!req.body.comment_id && req.body.updateObj) {
			return res.status(400).json({
				message: "Comment id is nessary for creating a post.",
			});
		}
		let commentExists = await comment_db.findCommentById(req.body.comment_id);
		if (!commentExists) {
			return res.status(404).json({ message: "Comment not found" });
		}
		await comment_db.updateComment(commentExists._id, req.body.updateObj);
		log.info("Successfuly modify the comment and added into the DB", {
			commentData: data,
			filename: fileName,
			method: functionName,
		});
		return res
			.status(200)
			.json({ message: "Comment modified successfully" });
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while updating comment.`,
			400,
			err
		);
		next(errorResult);
	}
};

const deleteComment = async (req, res, next) => {
	let data = req.user;
	const functionName = "deleteComment";
	try {
		log.info("Deleting comment from the DB", {
			filename: fileName,
			method: functionName,
		});
		if (!req.body.comment_id) {
			return res.status(400).json({
				message: "Comment id is nessary for deleting a comment.",
			});
		}
		let commentExists = await comment_db.findCommentById(req.body.comment_id);
		if (!commentExists) {
			return res.status(404).json({ message: "Comment not found" });
		}
		await comment_db.deleteComment(req.body.comment_id);
		log.info("Successfuly deleted the comment into the DB", {
			commentData: data,
			filename: fileName,
			method: functionName,
		});
		return res
			.status(200)
			.json({ message: "Comment deleted successfully" });
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while deleted comment.`,
			400,
			err
		);
		next(errorResult);
	}
};

module.exports = {
	createComment,
	likeComments,
	replyComment,
	modifyComment,
	deleteComment
};
