let mongoose = require('mongoose');

//Schema Setup
const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
        username: String
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;