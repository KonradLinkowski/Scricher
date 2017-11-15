const db = require('../setup/database-setup.js');

const post = {};

post.create = function(userID, text, done) {
    let values = [userID, text, new Date().toISOString()];

    db.get().query('INSERT INTO posts(user_id, text, date) VALUES(??, ??, ??)', values, (err, result) => {
        if (err) return done(err);
        done(null, result.insertID);
    });
}

post.getAll = function(done) {
    db.get().query('SELECT * FROM posts', (err, rows) => {
        if (err) return done(err);
        done(null, rows);
    });
}

post.getAllByUser = function(userID, done) {
    db.get().query('SELECT * FROM posts WHERE user_id = ??', userID, (err, rows) => {
        if (err) return done(err);
        done(null, rows);
    });
}