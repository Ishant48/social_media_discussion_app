const discussion_model = require("../../models/discussion_model");
const commonFunction = require("./common_functions");
const log = require("../../services/logger");
const filename = "discussion_db_api.js";

const createDiscussionPost = async (createObj) => {
	const functionName = 'createDiscussionPost';
	try {
		log.info("Creating discussion post into the db", {
			file: filename,
			method: functionName,
		});
		const postData = new discussion_model.discussion(createObj);
		log.info("Successfully created post into the db.", {
			file: filename,
			method: functionName,
		});
		return postData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while creating post.`, 400, err);
		return { Error: errorResult }
	}
};


const updateDiscussionPost = async (id,updateObj) => {
	const functionName = 'updateDiscussionPost';
	try {
		log.info("Updating discussion post into the db", {
			file: filename,
			method: functionName,
		});
		const postData = await discussion_model.discussion.findOneAndUpdate({_id:id},updateObj,{new:true});
		log.info("Successfully updated post into the db.", {
			file: filename,
			method: functionName,
		});
		return postData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while updating post.`, 400, err);
		return { Error: errorResult }
	}
};

const deleteDiscussionPost = async (id) => {
	const functionName = 'deleteDiscussionPost';
	try {
		log.info("Deleting discussion post into the db", {
			file: filename,
			method: functionName,
		});
		const postData = await discussion_model.discussion.findOneAndDelete({_id:id});
		log.info("Successfully deleted post into the db.", {
			file: filename,
			method: functionName,
		});
		return postData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while deleting post.`, 400, err);
		return { Error: errorResult }
	}
};

const findDiscussionPost = async (id) => {
	const functionName = 'findDiscussionPost';
	try {
		log.info("Finding discussion post into the db", {
			file: filename,
			method: functionName,
		});
		const postData = await discussion_model.discussion.findOne({_id:id});
		log.info("Successfully found post into the db.", {
			file: filename,
			method: functionName,
		});
		return postData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while finding post.`, 400, err);
		return { Error: errorResult }
	}
};

const getDiscussionsByTags = async (tags) => {
	const functionName = 'getDiscussionsByTags';
	try {
		log.info("Finding discussion post by tag into the db", {
			file: filename,
			method: functionName,
		});
		const postData = await discussion_model.discussion.find({ hashtags: { $in: tags } });
		log.info("Successfully found post by tag into the db.", {
			file: filename,
			method: functionName,
		});
		return postData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while finding post by tag.`, 400, err);
		return { Error: errorResult }
	}
};

const getDiscussionsByText = async (searchText) => {
	const functionName = 'getDiscussionsByText';
	try {
		log.info("Finding discussion post by text into the db", {
			file: filename,
			method: functionName,
		});
		const postData = await discussion_model.discussion.find({ content: { $regex: searchText, $options: 'i' } });
		log.info("Successfully found post by text into the db.", {
			file: filename,
			method: functionName,
		});
		return postData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while finding post by text.`, 400, err);
		return { Error: errorResult }
	}
};

module.exports = {
    createDiscussionPost,
    updateDiscussionPost,
    deleteDiscussionPost,
    findDiscussionPost,
    getDiscussionsByTags,
	getDiscussionsByText
}