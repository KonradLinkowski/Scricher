const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user_id: { type: Schema.Types.ObjectId, ref: 'user'},
    message: String,
    date: Date
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;