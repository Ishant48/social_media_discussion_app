const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
    mobile_number:{
        type: String,
		unique: true,
        required: true,
    },
    email:{
        type: String,
		unique: true,
		required: true,
    },
	active: {
		type: Boolean,
		default: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
    follows:[
        Schema.ObjectId
    ],
	created_at: {
		type: Date,
		default: Date.now,
	},
});


const userLogSchema = new Schema({
	created_ts: {
		type:Number
	},
	user_id:{
		type:Schema.Types.ObjectId,
		required:true,
		ref:'user'
	},
	url: {
		type: String
	},
	status_code: {
		type: Number
	},
	request_type:{
		type: String
	},
	result: {
		type: String
	}

});



const user = mongoose.model("user", userSchema);
const userLogging = mongoose.model('userLogs', userLogSchema)

module.exports = { user, userLogging };