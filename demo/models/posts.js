let mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    title: String,
    content: String
});

let Post = mongoose.model('Post', postSchema);

module.exports = Post;