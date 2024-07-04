const comment_model = require("../../models/comment_model");
const commonFunction = require("./common_functions");
const ObjectId = require("mongodb").ObjectID;
const log = require("../../services/logger");
const filename = "comment_db_api.js";

const addComment = async (createObj) => {
	const functionName = 'addComment';
	try {
		log.info("Creating comment into the db", {
			file: filename,
			method: functionName,
		});
		const commentData = new comment_model.comment(createObj);
		await commentData.save();
		log.info("Successfully created comment into the db.", {
			file: filename,
			method: functionName,
		});
		return commentData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while creating comment.`, 400, err);
		return { Error: errorResult }
	}
};



const likeComment = async (comment,comment_id) => {
	console.log(comment,comment_id)
	const functionName = 'likeComment';
	try {
		log.info("Like comment into the db", {
			file: filename,
			method: functionName,
		});
		const commentData = await comment_model.comment.findOneAndUpdate(
			{ _id: comment._id },
			{ $addToSet: { likes: ObjectId(comment_id) } },
			{ new: true, useFindAndModify: false }
		  );
		log.info("Successfully like comment into the db.", {
			file: filename,
			method: functionName,
		});
		return commentData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while creating like to comment.`, 400, err);
		return { Error: errorResult }
	}
};

const findCommentById = async (id) => {
	const functionName = "findcomment";
	try {
		log.info("Getting comment data from the function", {
			file: filename,
			method: functionName,
		});
		const commentData = await comment_model.comment.findOne({ _id: id });
		log.info("Successfully fetched comment info into the db.", {
			file: filename,
			method: functionName,
		});
		return commentData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while fetching comment.`,
			400,
			err
		);
		return { Error: errorResult };
	}
};


const updateComment = async (updateId,content) => {
	const functionName = "updateComment";
	try {
		log.info("Updating comment data from the function", {
			file: filename,
			method: functionName,
		});
		const commentData = await comment_model.comment.findOneAndUpdate({ _id: updateId },{content:content});
		log.info("Successfully updated comment info into the db.", {
			file: filename,
			method: functionName,
		});
		return commentData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while updated comment.`,
			400,
			err
		);
		return { Error: errorResult };
	}
};

const deleteComment = async (deleteId) => {
	const functionName = "deleteComment";
	try {
		log.info("Deleting comment data from the function", {
			file: filename,
			method: functionName,
		});
		const commentData = await comment_model.comment.findOneAndDelete({_id:deleteId});
		log.info("Successfully deleted comment info into the db.", {
			file: filename,
			method: functionName,
		});
		return commentData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while deleted comment.`,
			400,
			err
		);
		return { Error: errorResult };
	}
};

module.exports = {
    addComment,
    likeComment,
    findCommentById,
    updateComment,
    deleteComment
}