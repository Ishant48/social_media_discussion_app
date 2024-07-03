const passport = require("passport");

const tokenAccessVerification = (req, res, next) => {
	passport.authenticate(
		"jwt",
		{
			session: false,
		},
		async (err, data, info) => {
			if (err || !data) {
				return res.status(400).json({
					message:
						info && info.hasOwnProperty("message")
							? "Token Expired"
							: err || "An issue occurred.",
					data,
					info,
				});
			}
			req.user = data;
			next();
		}
	)(req, res, next);
};

module.exports = {
	tokenAccessVerification: tokenAccessVerification,
};
