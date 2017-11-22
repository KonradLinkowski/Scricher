const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    email: String,
    creation: Date,
    last_login: Date
});

const User = mongoose.model('user', UserSchema);

module.exports = User;