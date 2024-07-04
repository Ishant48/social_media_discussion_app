const log = require("../../services/logger");
const user_model = require("../../models/user_model");
const commonFunction = require("./common_functions");
const fileName = 'user_logs.js';

const requestLogger = (req, res, next) => {
	const functionName = "requestLogger";
	res.on('finish', async () => {
		try {
			log.info("Adding user request logs into db.", {
				file: fileName,
				method: functionName,
			});
			if (req.user) {
				const logData = {
					user_id: req.user._id,
					url: req.originalUrl,
					status_code: res.statusCode,
					result: res.statusMessage,
					created_ts: Date.now(),
					request_type: req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)
				};
				const logResult = new user_model.userLogging(logData);
				await logResult.save();
				log.info("Successfully saved user log into the db.", {
					file: fileName,
					method: functionName,
				});
				next();
			}
		} catch (err) {
			const errorResult = await commonFunction.catchErrorHandling(`Error occurred while saving user log details into db.`, 400, err);
			next(errorResult);
		}
	});
	next();
}

module.exports = requestLogger;