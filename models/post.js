const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user_email: { type: String, ref: 'user'},
    message: String,
    date: Date
});

const PostSchema = new Schema({
    user_email: { type: String, ref: 'user'},
    message: String,
    date: Date,
    comments: [CommentSchema]
});

const Post = mongoose.model('post', PostSchema, 'posts');

module.exports = Post;