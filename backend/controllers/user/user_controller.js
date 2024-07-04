const user_db = require("../../services/database_functions/user_db_api");
const commonFunction = require("../../services/database_functions/common_functions");
const bcrypt = require("bcryptjs");
const log = require("../../services/logger");
const saltRounds = bcrypt.genSaltSync(10);
const fileName = "user_controller.js";

const createUser = async (req, res, next) => {
	const functionName = "createUser";
	try {
		log.info("Creating user and adding into the DB", {
			filename: fileName,
			method: functionName,
		});
		let { name, password, email, mobile_number } = req.body;
		if (name && password && email && mobile_number) {
			// Validate name: only letters and spaces, at least 2 characters
			const nameRegex = /^[a-zA-Z\s]{2,}$/;
			if (!nameRegex.test(name)) {
				return res.status(400).json({
					message:
						"Name should contain only letters and spaces and be at least 2 characters long.",
				});
			}

			// Validate email: standard email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({
					message: "Invalid email format.",
				});
			}

			// Validate mobile number: 10 digits
			const mobileRegex = /^\d{10}$/;
			if (!mobileRegex.test(mobile_number)) {
				return res.status(400).json({
					message: "Mobile number should contain exactly 10 digits.",
				});
			}

			// Convert name to lowercase
			const lowerCaseName = name.toLowerCase();

			// Validate password
			const passwordRegex =
				/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			if (password.length < 8) {
				return res.status(400).json({
					message: "Password length must be greater than 8.",
				});
			}
			if (!passwordRegex.test(password)) {
				return res.status(400).json({
					message:
						"Password should contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.",
				});
			}

			// Hash the password
			const passwordHash = bcrypt.hashSync(password, saltRounds);

			try {
				let userData = await user_db.createUserDetails(
					lowerCaseName,
					passwordHash,
					email,
					mobile_number
				);
                if(userData.Error){
                    return res
						.status(500)
						.json({ message: `Error occurred while creating user.${userData.Error}` });
                }
				else if (userData.name) {
					log.info("Successfully created user and added into the DB", {
						filename: fileName,
						method: createUser.name,
					});
					return res
						.status(200)
						.json({ message: "User created successfully!" });
				} else {
					return res
						.status(500)
						.json({ message: "Error occurred while creating user." });
				}
			} catch (err) {
				const errorResult = await commonFunction.catchErrorHandling(
					"Error occurred while adding user to the DB.",
					400,
					err
				);
				next(errorResult);
			}
		} else {
			return res
				.status(400)
				.json({
					message:
						"All fields are required: name, password, email, mobile number.",
				});
		}
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while creating user.`,
			400,
			err
		);
		next(errorResult);
	}
};

const updateUser = async (req, res, next) => {
	let data = req.user;
	const functionName = "updateUser";
	try {
		log.info("Updating user into the DB", {
			userData: data,
			filename: fileName,
			method: functionName,
		});
		let userDoc = await user_db.findUser({email:req.body.email});
		if (req.body.email === data.email) {
			if (userDoc) {
				let updateObj = {};
				if (req.body.name) {
					const nameRegex = /^[a-zA-Z\s]{2,}$/;
					if (!nameRegex.test(req.body.name)) {
						return res.status(400).json({
							message:
								"Name should contain only letters and spaces and be at least 2 characters long.",
						});
					}
					updateObj.name = req.body.name.toLowerCase();
				}

				if (req.body.newPassword) {
					const passwordRegex =
						/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
					if (req.body.newPassword.length < 8) {
						return res.status(400).json({
							message: "Password length must be greater than 8.",
						});
					}
					if (!passwordRegex.test(req.body.newPassword)) {
						return res.status(400).json({
							message:
								"Password should contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.",
						});
					}
					const password = bcrypt.hashSync(req.body.newPassword, saltRounds);
					updateObj.passwordHash = password;
				}

				if (req.body.email) {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(req.body.email)) {
						return res.status(400).json({
							message: "Invalid email format.",
						});
					}
					updateObj.email = req.body.email;
				}

				if (req.body.mobile_number) {
					const mobileRegex = /^\d{10}$/;
					if (!mobileRegex.test(req.body.mobile_number)) {
						return res.status(400).json({
							message: "Mobile number should contain exactly 10 digits.",
						});
					}
					updateObj.mobile_number = req.body.mobile_number;
				}

				try {
					let updatedUser = await user_db.updateUserDetails(
						userDoc._id,
						updateObj
					);
                    if(updatedUser.Error){
                        return res
                            .status(500)
                            .json({ message: `Error occurred while updating user.${updatedUser.Error}` });
                    }
					else if (updatedUser.name) {
						log.info("Successfully updated user into the DB", {
							userData: data,
							filename: fileName,
							method: functionName,
						});
						return res
							.status(200)
							.json({ message: "User updated successfully!" });
					} else {
						log.info("Error occured while updating user into the DB", {
							userData: data,
							filename: fileName,
							method: functionName,
						});
						return res
							.status(500)
							.json({ message: "Error occurred while updating user." });
					}
				} catch (err) {
					const errorResult = await commonFunction.catchErrorHandling(
						"Error occurred while updating user in the DB.",
						400,
						err
					);
					next(errorResult);
				}
			} else {
				return res.status(400).json({ message: "User Doesn't exists!!!" });
			}
		} else {
			return res
				.status(400)
				.json({ message: "You cannot update another user!!!" });
		}
	} catch (err) {}
};

const deleteUser = async (req, res, next) => {
	let data = req.user;
	const functionName = "deleteUser";
	try {
		log.info("Deleting user from the database", {
			userData: data,
			file: fileName,
			method: functionName,
		});
		if (req.body.email) {
			if (req.body.email === data.email) {
				let userExists = await user_db.findUser({email:req.body.email});
				if (!userExists) {
					return res.status(400).json({ message: "User Doesn't Exists!!!" });
				}
				let userDeleted = await user_db.deleteUserDetails(req.body.email);
                if(userDeleted.Error){
                    return res
                        .status(500)
                        .json({ message: `Error occurred while deleting user.${userDeleted.Error}` });
                }
				else if (userDeleted.name) {
					log.info("Succesfully Deleted user from the DB", {
						userData: data,
						file: fileName,
						method: functionName,
					});
					return res
						.status(200)
						.json({ message: "The user was successfully removed." });
				} else {
					return res
						.status(400)
						.json({ message: "Error occurred while deleting user" });
				}
			} else {
				return res
					.status(400)
					.json({ message: "You cannot delete another user!!!" });
			}
		}
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while deleting user from the DB.`,
			400,
			err
		);
		next(errorResult);
	}
};

const searchUser = async (req, res, next) => {
	let data = req.user;
	const functionName = "searchUser";
	try {
		log.info("Searching user from the database", {
			userData: data,
			file: fileName,
			method: functionName,
		});
		if (req.body.name) {
			log.info("Successfully searched user from the database", {
				userData: data,
				file: fileName,
				method: functionName,
			});
			const userList = await user_db.searchUserByName(req.body.name);
            if(userList.Error){
                return res
                    .status(500)
                    .json({ message: `Error occurred while search user.${userList.Error}` });
            }
			return res
						.status(200)
						.json(userList);
		} else {
			log.info("Error occured while searching user from the database", {
				userData: data,
				file: fileName,
				method: functionName,
			});
			return res
				.status(400)
				.json({ message: "Error occurred while finding user" });
		}
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while fetching user from the DB.`,
			400,
			err
		);
		next(errorResult);
	}
};

const getUsersList = async (req, res, next) => {
	let data = req.user;
	const functionName = "getUsersList";
	try {
		const usersData = await user_db.getUserListDetails();
		if (usersData) {
			log.info("Succesfully fetches all users from the db", {
				userData: data,
				file: fileName,
				method: functionName,
			});
			return res.status(200).json(usersData);
		} else {
			return res
				.status(400)
				.json({ message: "Error occurred while feching users data!!!" });
		}
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while fetching users data from the DB.`,
			400,
			err
		);
		next(errorResult);
	}
};

const followUser = async (req, res, next) => {
	let data = req.user;
	const functionName = "followUser";
	try {
		log.info("Follow user and adding to db", {
			file: fileName,
			method: functionName,
		});
		const userIdToFollow = req.params.user_id;
		const userId = data._id;
		// Check if the user is trying to follow themselves
		if (userId === userIdToFollow) {
			return res.status(400).json({ message: "You cannot follow yourself" });
		}

		const userToFollow = await user_db.findUser({_id:userIdToFollow});
		if (!userToFollow) {
			return res.status(404).json({ message: "User not found" });
		}
        const ownUser = await user_db.findUser({_id:userId});
		// Check if the user is already following the userToFollow
		if (ownUser.following.includes(userIdToFollow)) {
			return res
				.status(400)
				.json({ message: "You are already following this user" });
		}
		const userData = await user_db.addfollowUser(userId,userToFollow._id);
        if(userData.Error){
            return res
                .status(500)
                .json({ message: `Error occurred while follow user.${userData.Error}` });
        }else{
            return res
                .status(200)
                .json({ message: `You are following the user ${userData.name}` });
        }
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(
			`Error occurred while fetching user from the DB.`,
			400,
			err
		);
		next(errorResult);
	}
};

module.exports = {
	createUser,
	deleteUser,
	updateUser,
	getUsersList,
	searchUser,
	followUser,
};
