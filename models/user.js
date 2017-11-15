const db = require('../setup/database-setup.js');

const user = {};

user.create = function(email, password, done) {
    let values = [email, password, new Date().toISOString()];

    db.get().query('INSERT INTO users(email, password, date, date) VALUES(??, ??, ??, ??)', values, (err, result) => {
        if (err) return done(err);
        done(null, result.insertID);
    });
}

user.getUser = function(userID, done) {
    db.get().query('SELECT * FROM posts WHERE user_id = ??', userID, (err, rows) => {
        if (err) return done(err);
        done(null, rows);
    });
}

module.exports = user;