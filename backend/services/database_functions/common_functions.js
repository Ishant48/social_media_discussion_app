const mongoose = require("mongoose");
const config = require("dotenv").config().parsed;
const log = require("../logger");



//database connection
let cachedDb = null;
async function connectToDatabase() {
	log.info("connect to database");
	if (cachedDb) {
		log.info("using cached database instance");
		return Promise.resolve(cachedDb);
	}
	try {
		log.info("using new instance");
		let db;
		if (config.NODE_ENV.includes("local")) {
			log.info("DB connection estabhlishment started");
			mongoose.set("strictQuery", false);
			db = await mongoose.connect(config.MONGO_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
		} else {
			log.info("i am production account");
		}
		dbTest = db;
		cachedDb = db.connections[0].readyState;
		log.info("Database Connection estabhlished.")
		return cachedDb;
	} catch (err) {
		log.error(`Unable to connect to MongoDb - ${err}`);
		throw err;
	}
}

mongoose.connection.on("error", (err) => {
	log.error(`ErrorLog::Connection error with mongo ${err}`);
	throw err;
});

//catch error handling
async function catchErrorHandling(errorString, errorCode, err) {
	try {
		log.error(`${errorString} , Error::: ${err}`);
		const msg = `${err.message}`;
		let error = new Error(`${errorString} , Error::: ${err}`);
		error.statusCode = errorCode;
		error.message = msg;
		return error;
	} catch {
		log.error(`ErrorLog:: Catch block error occured  ${err}`);
		throw err;
	}
}


module.exports = { connectToDatabase, catchErrorHandling}