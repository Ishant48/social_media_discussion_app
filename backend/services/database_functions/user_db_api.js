const user_model = require("../../models/user_model");
const commonFunction = require("./common_functions");
const log = require("../../services/logger");
const filename = "user_db_api.js";

const createUserDetails = async (username, passwordHash, email,mobile_number) => {
	const functionName = 'createUserDetails';
	try {
		log.info("Getting user data from the function", {
			file: filename,
			method: functionName,
		});
		const userData = new user_model.user({
			username: username,
			passwordHash: passwordHash,
            email:email,
            mobile_number:mobile_number
		});
		await userData.save();
		log.info("Successfully saved user info into the db.", {
			file: filename,
			method: functionName,
		});
		return userData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while creating user.`, 400, err);
		return { Error: errorResult }
	}
};

const findUser = async (username) => {
	const functionName = 'findUser';
	try {
		log.info("Getting user data from the function", {
			file: filename,
			method: functionName,
		});
		const userData = await user_model.user.findOne({ username: username });
		log.info("Successfully fetched user info into the db.", {
			file: filename,
			method: functionName,
		});
		return userData;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while fetching user.`, 400, err);
		return { Error: errorResult }
	}
};

const updateUserDetails = async (id, updateObj) => {
	const functionName = 'updateUserDetails';
	try {
		log.info("Getting user data from the function", {
			file: filename,
			method: functionName,
		});
		let userDoc = await user_model.user.findOneAndUpdate(
			{
				_id: id,
			},
            updateObj
		);
		await userDoc.save();
        delete userDoc.passwordHash;
		log.info("Successfully update user data into the db.", {
			file: filename,
			method: functionName,
		});
		return userDoc;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while updating user details.`, 400, err);
		return { Error: errorResult }
	}
};

const deleteUserDetails = async (name) => {
	const functionName = 'deleteUserDetails';
	try {
		log.info("Getting user data from the function", {
			file: filename,
			method: functionName,
		});
		await user_model.user.findOneAndRemove({ name: name });
		log.info("Successfully deleted user info from the db.", {
			file: filename,
			method: functionName,
		});
		return true;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while deleting user.`, 400, err);
		return { Error: errorResult }
	}
};

const getUserListDetails = async () => {
	const functionName = 'getUserListDetails';
	try {
		log.info("Getting users data from the database", {
			file: filename,
			method: functionName,
		});
		const userList = await user_model.user.find({}, "name email mobile_number -_id");
		log.info("Successfully fetched all users from the db.", {
			file: filename,
			method: functionName,
		});
		return userList;
	} catch (err) {
		const errorResult = await commonFunction.catchErrorHandling(`Error occurred while fetching users.`, 400, err);
		return { Error: errorResult }
	}
};

const searchUserByName = async (name) =>  {
    const functionName = 'searchUserByName';
    try {
        log.info("Getting users data from the database", {
			file: filename,
			method: functionName,
		});
      const regex = new RegExp(name, 'i'); // 'i' for case insensitive
      const users = await user_model.user.find({ name: { $regex: regex } });
      log.info("Successfully fetched all users from the db.", {
        file: filename,
        method: functionName,
    });
      return users;
    } catch (err) {
        const errorResult = await commonFunction.catchErrorHandling(`Error occurred while fetching users by name.`, 400, err);
		return { Error: errorResult }
    }
  }



module.exports = {
	createUserDetails,
	findUser,
    searchUserByName,
    updateUserDetails,
	deleteUserDetails,
	getUserListDetails
}
