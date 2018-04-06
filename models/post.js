const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {type:  mongoose.Schema.Types.ObjectId, ref: 'user'},
    message: {type: String, required: true},
    date: {type: Date, default: Date.now()},
    comments: [{type:  mongoose.Schema.Types.ObjectId, ref: 'comment'}]
});

const Post = mongoose.model('post', PostSchema, 'posts');

module.exports = Post;