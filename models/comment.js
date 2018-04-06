const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: { type:  mongoose.Schema.Types.ObjectId, ref: 'post'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  message: {type: String, required: true},
  date: {type: Date, default: Date.now()}
});

CommentSchema.virtual('posts', {
  ref: 'post',
  localField: '_id',
  foreignField: 'comments'
});

module.exports = mongoose.model('comment', CommentSchema, 'comments');