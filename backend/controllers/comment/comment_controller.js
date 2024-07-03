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
				log.info("Creating comment and adding into the DB", {
					commentData: data,
					filename: fileName,
					method: functionName,
				});
				const newPost = await comment_db.createCommentPost(createdObj);
				res.status(201).json(newPost);
			} catch (err) {
				const errorResult = await commonFunction.catchErrorHandling(
					`Error occurred while creating comment.`,
					400,
					err
				);
				next(errorResult);
			}
		});
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while creating comment.`,
			400,
			err
		);
		next(errorResult);
	}
};


module.exports = {
    createComment
}