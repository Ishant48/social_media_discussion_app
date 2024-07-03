const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const discussionSchema = new Schema({
    created_ts: {
        type: Number,
        default: Date.now
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    text: {
        type: String
    },
    image: {
        filename: String,
        path: String,
        originalName: String,
    },
    hastag: [String],
});



const discussion = mongoose.model("discussion", discussionSchema);

module.exports = { discussion };