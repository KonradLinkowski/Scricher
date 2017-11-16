const db = require('../config/database-setup.js');
const bcrypt = require('bcryptjs');

const user = {};

user.create = function(email, password, done) {
    let values = [email, password, new Date().toISOString()];
    hashPassword(password, (err) => {
        if (err) return done(err);
    });

    db.get().query('INSERT INTO users(email, password, creation, last_login) VALUES(??, ??, ??, ??)', values, (err, result) => {
        if (err) return done(err);
        done(null, result.insertID);
    });
}

user.getUser = function(userID, done) {
    db.get().query('SELECT userID FROM Users WHERE user_id = ??', userID, (err, rows) => {
        if (err) return done(err);
        done(null, rows);
    });
}

function hashPassword(password, next) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(password, salt, null, (err, hash) => {
            if (err) return next(err);
            password = hash;
            next();
        });
    });
}

user.comparePassword = function (password, cb) {
    bcrypt.compare(password, original, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
}

module.exports = user;