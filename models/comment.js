const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    message: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

module.exports = CommentSchema;