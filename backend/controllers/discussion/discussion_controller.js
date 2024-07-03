const discussion_db = require("../../services/database_functions/discussion_db_api");
const multer = require("multer");
const commonFunction = require("../../services/database_functions/common_functions");
const log = require("../../services/logger");
const fileName = "discussion_controller.js";

const createDiscussion = async (req, res, next) => {
	let data = req.user;
	const functionName = "createDiscussion";
	try {
		log.info("Creating discussion and adding into the DB", {
			discussionData: data,
			filename: fileName,
			method: functionName,
		});
		if (!req.body.content) {
			return res.status(400).json({
				message: "Content is nessary for creating a post.",
			});
		}
		const upload = multer({ dest: "uploads/" }).array("file", 1); // Allow only one file
		upload(req, res, async function (err) {
			if (err) {
				// Log the error using userLogs if needed
				return res.status(500).json({ message: "File upload failed!!!" });
			}

			if (req.files.length > 1) {
				return res.status(400).json({ message: "Only one file is allowed." });
			}

			const file = req.files[0];

			if (!req.body.content) {
				return res.status(400).json({
					message: "Content is necessary for creating a post.",
				});
			}
			let createdObj = {
				user_id: data._id,
				content: req.body.content,
			};
			if (file) {
				const originalFilename = req.file.originalname;
				const fileExt = path.extname(originalFilename); // Get file extension;
				const fileName = `${
					path.parse(originalFilename).name
				}_${Date.now()}.${fileExt}`;
				createdObj.image = fileName;
				createdObj.hashtags = req.body.hashtags
					? req.body.hashtags.split(",")
					: [];
			} else {
				createdObj.hashtags = req.body.hashtags
					? req.body.hashtags.split(",")
					: [];
			}
			try {
				log.info("Creating discussion and adding into the DB", {
					discussionData: data,
					filename: fileName,
					method: functionName,
				});
				const newPost = await discussion_db.createDiscussionPost(createdObj);
				res.status(201).json(newPost);
			} catch (err) {
				const errorResult = await commonFunction.catchErrorHandling(
					`Error occurred while creating discussion.`,
					400,
					err
				);
				next(errorResult);
			}
		});
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while creating discussion.`,
			400,
			err
		);
		next(errorResult);
	}
};

const updateDiscussion = async (req, res, next) => {
	let data = req.user;
	const functionName = "updateDiscussion";
	try {
		log.info("Updating discussion into the DB", {
			filename: fileName,
			method: functionName,
		});
		if (
			req.body.email &&
			(req.body.content || req.body.hashtags) &&
			req.body.discussion_id
		) {
			if (data.email === req.body.email) {
				let discussionExists = await discussion_db.findDiscussionPost(
					req.body.discussion_id
				);
				if (!discussionExists) {
					return res
						.status(400)
						.json({ message: "Discussion doesn't exists!!!" });
				}
				let updateObj = {};
				if (req.body.content) {
					updateObj.content = req.body.content;
				}
				if (req.body.hashtags) {
					updateObj.hashtags = req.body.hashtags
						? req.body.hashtags.split(",")
						: [];
				}
				await discussion_db.updateDiscussionPost(
					req.body.discussion_id,
					updateObj
				);
				log.info("Successfully updated discussion into the DB", {
					filename: fileName,
					method: functionName,
				});
				return res
					.status(200)
					.json({ message: "Discussion Updated successfully!!!" });
			} else {
				return res
					.status(400)
					.json({ message: "Unauthorised to update a discussion!!!" });
			}
		} else {
			return res
				.status(400)
				.json({ message: "Fields are missing to update a discussion!!!" });
		}
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while updating discussion.`,
			400,
			err
		);
		next(errorResult);
	}
};

const deleteDiscussion = async (req, res, next) => {
	let data = req.user;
	const functionName = "deleteDiscussion";
	try {
		log.info("Deleting discussion into the DB", {
			filename: fileName,
			method: functionName,
		});
		if (req.body.discussion_id) {
			if (data.email === req.body.email) {
				let discussionExists = await discussion_db.findDiscussionPost(
					req.body.discussion_id
				);
				if (!discussionExists) {
					return res
						.status(400)
						.json({ message: "Discussion doesn't exists!!!" });
				}
				await discussion_db.deleteDiscussionPost(req.body.discussion_id);
				log.info("Successfully deleted discussion into the DB", {
					filename: fileName,
					method: functionName,
				});
				return res
					.status(400)
					.json({ message: "Discussion deleted successfully!!!" });
			} else {
				return res
					.status(400)
					.json({ message: "Unauthorised to delete a discussion!!!" });
			}
		} else {
			return res
				.status(400)
				.json({ message: "Fields are missing to delete a discussion!!!" });
		}
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while deleting discussion.`,
			400,
			err
		);
		next(errorResult);
	}
};

const getDiscussionByTag = async (req, res, next) => {
	let data = req.user;
	const functionName = "getDiscussionByTag";
	try {
        if(data && req.body.tags){
            log.info("Fetching discussions  by tag from the DB", {
                filename: fileName,
                method: functionName,
            });
            const tags = req.body.tags.split(',').map(tag => tag.trim());
            const discussionList = await discussion_db.getDiscussionsByTags(tags);
            log.info("Successfully fetched discussions from the DB", {
                filename: fileName,
                method: functionName,
            });
            return res.status(200).json(discussionList);
        }
		return res.status(401).json({message:"Unauthorised to perform the request!!!"});
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while fetching discussions list by tag.`,
			400,
			err
		);
		next(errorResult);
	}
};

const getDiscussionByText = async (req, res, next) => {
	let data = req.user;
	const functionName = "getDiscussionByText";
	try {
        if(data && req.body.text){
            log.info("Fetching discussions by text from the DB", {
                filename: fileName,
                method: functionName,
            });
            const discussionList = await discussion_db.getDiscussionsByText(text);
            log.info("Successfully fetched discussions from the DB", {
                filename: fileName,
                method: functionName,
            });
            return res.status(200).json(discussionList);
        }
		return res.status(401).json({message:"Unauthorised to perform the request!!!"});
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while fetching discussions list by tag.`,
			400,
			err
		);
		next(errorResult);
	}
};


const incrementViewCount = async (req, res, next) => {
	let data = req.user;
	const functionName = "incrementViewCount";
	try {
        if(req.params.discussion_id){
            log.info("Fetching discussions from the DB", {
				userData:data,
                filename: fileName,
                method: functionName,
            });
            const discussionExists = await discussion_db.findDiscussionPost(req.params.discussion_id);
			if(!discussionExists){
				return res.status(400).json({message:"Post doesn't exist!!!"});
			}
			const postData = await discussion_db.incrementViewCounts(discussionExists._id);
            log.info("Successfully increment over post into the DB", {
                filename: fileName,
                method: functionName,
            });
            return res.status(200).json(postData);
        }
		return res.status(401).json({message:"Unauthorised to perform the request!!!"});
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while fetching discussions list by tag.`,
			400,
			err
		);
		next(errorResult);
	}
};

module.exports = {
	createDiscussion,
	updateDiscussion,
	deleteDiscussion,
	getDiscussionByTag,
    getDiscussionByText,
	incrementViewCount
};
