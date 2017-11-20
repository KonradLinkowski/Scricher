const db = require('../config/database-setup.js');
const bcrypt = require('bcryptjs');

class User {

    constructor(object) {
        this.object = object;
    }

    save() {
        let date = new Date().toISOString();
        let values = [this.email, this.password, date, date];
        hashPassword(this.password, (err) => {
            if (err) return done(err);
        });
        db.get().query('INSERT INTO users(email, password, creation, last_login) VALUES(??, ??, ??, ??)', values, (err, result) => {
            if (err) return done(err);
            done(null, result.insertID);
        });
    }

    getOneUser(userID, then) {
        db.get().query('SELECT userID FROM Users WHERE user_id = ??', userID, (err, rows) => {
            if (err) return then(err);
            then(null, rows);
        });
    }

    hashPassword(password, next) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(password, salt, null, (err, hash) => {
                if (err) return next(err);
                password = hash;
                next();
            });
        });
    }

    comparePassword(password, cb) {
        bcrypt.compare(password, original, (err, isMatch) => {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    }
}
module.exports = User;