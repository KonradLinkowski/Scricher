const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    creation: Date,
    last_login: Date
});

const User = mongoose.model('user', UserSchema, 'users');

module.exports = User;