const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passportJWT = require("passport-jwt");
const config = require("dotenv").config().parsed;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const user_model = require("../models/user_model")


passport.use(
	"user_login",
	new LocalStrategy(
		{
			usernameField: "username",
			passwordField: "password",
		},
		async (username, password, done) => {
			try {
				const userDoc = await user_model.user.findOne(
					{
						name: (username).toLocaleLowerCase(),
					},
					"name passwordHash email"
				);
				if (userDoc) {
					const passwordMatch = bcrypt.compareSync(
						password,
						userDoc.passwordHash
					);

					if (passwordMatch) {
						if (userDoc.active === false) {
							return done(
								"Your account has been suspended. Please contact your supervisor for reactivation."
							);
						}
						userDoc.passwordHash = undefined; // remove password hash from sending to client
						return done(null, userDoc);
					} else {
						return done("Incorrect name or Password");
					}
				} else {
					return done("Incorrect name or Password");
				}
			} catch (err) {
				console.log(err, "ErrorLog::");
				done(err);
			}
		}
	)
);

if (config.NODE_ENV.toLowerCase().includes("local")) {
	passport.use(
		"jwt",
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
				secretOrKey: config.JWT_KEY,
			},
			async (jwtPayload, done) => done(null, jwtPayload.user)
		)
	);
}
