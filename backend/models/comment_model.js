const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const commentSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    discussion: { type: Schema.Types.ObjectId, ref: 'post', required: true },
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    replies: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
    created_ts: {
        type: Number,
        default: Date.now
    },
});


const comment = mongoose.model("comment", commentSchema);

module.exports = { comment };