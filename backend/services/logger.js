const config = require("dotenv").config().parsed;
const winston = require("winston");
require("winston-mongodb");

let logger;
if (config.NODE_ENV === "production") {
	logger = winston.createLogger({
		level: "info",
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.json()
		),
		transports: [
			new winston.transports.File({ filename: "error.log", level: "error" }),
			new winston.transports.File({ filename: "combined.log" }),
		],
	});
} else {
	logger = winston.createLogger({
		transports: [
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.json()
				),
			}),
			new winston.transports.File({
				filename: "discussion_app_logs.txt",
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.json()
				),
			}),
			new winston.transports.MongoDB({
				db: `${config.MONGO_URL}`,
				options: { useUnifiedTopology: true },
				collection: "logs",
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.json()
				),
			})
		],
	});
}


module.exports = logger;
