const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;


const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {type: String, index: {unique: true}},
    password: {type: String, required: true},
    creation: {type: Date, default: Date.now()},
    last_login: {type: Date},
    role: {type: Number, default: 0}
},{
    id: false,
    toJSON: { virtuals: true },
});

UserSchema.virtual('posts', {
    ref: 'post',
    localField: '_id',
    foreignField: 'user'
});

UserSchema.virtual('comments', {
    ref: 'comment',
    localField: '_id',
    foreignField: 'user'
});

UserSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('user', UserSchema, 'users');

module.exports = User;