const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = require('./comment');

const PostSchema = new Schema({
    user_email: {type:  mongoose.Schema.Types.ObjectId, ref: 'user'},
    message: {type: String, required: true},
    date: {type: Date, default: Date.now},
    comments: [CommentSchema]
});

const Post = mongoose.model('post', PostSchema, 'posts');

module.exports = Post;