const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const log = require("./services/logger");
const fs = require('fs');
const commonFunction = require("./services/database_functions/common_functions");
require("./services/auth-service");
const userLogs = require("./services/database_functions/user_logs");

const app = express();
const http = require('http').Server(app);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

async function init() {
	await commonFunction.connectToDatabase();
	app.use(cors());
	app.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Credentials", true);
		next();
	});
	app.use(bodyParser.json());
	app.use(
		bodyParser.urlencoded({
			extended: true,
		})
	);
	const helmet = require("helmet");
	app.use(helmet());
	app.use("/api", userLogs);
	const routes = require("./routes/index");
	app.use("/api", routes);
	app.use(function (err, req, res, next) {
		log.error(err); // Log error message in our server's console
		if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
		res.status(err.statusCode).send({
			message: err.message,
		}); // All HTTP requests must have a response, so let's send back an error with its status code and message
	});
}

const PORT = 3000;

http.listen(PORT, '0.0.0.0', () => {
	log.info(`Server is running on port ${PORT}.`);
	init(); // Call init() after the server starts listening
});
