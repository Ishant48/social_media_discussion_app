const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("dotenv").config().parsed;
const loginController = express.Router();

loginController.post("/:id", (req, res) => {
	const strategy = req.params.id;

	// Check if the strategy is valid before calling passport.authenticate
	if (!isValidStrategy(strategy)) {
		return res.status(400).json({
			message: "Invalid authentication or URL",
		});
	}
	passport.authenticate(
		strategy,
		{
			session: false,
		},
		async (err, user, info) => {
			if (err || !user) {
				return res.status(400).json({
					message:
						info && info.hasOwnProperty("message")
							? "Token Expired"
							: err || "An issue occurred.",
					user: user,
				});
			}
			let token;
			if (config.NODE_ENV.toLowerCase().includes("local")) {
				token = jwt.sign(
					{
						user: user,
						token_exp: "21,600,000",
					},
					config.JWT_KEY,
					{
						expiresIn: "6h",
					}
				);
			}
			req.user = user;
			return res.status(200).json({
				user: user,
				token: token,
			});
		}
	)(req, res);
});

// Function to check if the authentication strategy is valid
function isValidStrategy(strategy) {
	const allowedStrategies = ["user_login"];
	return allowedStrategies.includes(strategy);
}

module.exports = loginController;
