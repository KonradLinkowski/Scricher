const mysql = require('mysql');
const async = require('async');
const keys = require('./keys');

const database = {};

database.mode = {
    TEST: keys.database.database.test,
    PRODUCTION: keys.database.database.production
}

const state = {
    pool: null,
    mode: null
}
database.connect = function(mode, done) {
    state.pool = mysql.createPool({
        host: keys.database.host,
        user: keys.database.user,
        password: keys.database.password,
        database: mode == database.mode.PRODUCTION
            ? database.mode.PRODUCTION
            : database.mode.TEST
    });
    state.mode = database.mode;
    
}

database.get = function() {
    return state.pool;
}

database.fixtures = function(data) {
    if (!state.pool)
        return done(new Error('Missing database connection.'));

    let names = Object.keys(data.tables);
    async.each(names, (name, cb) => {
        async.each(data.tables[name], (row, cb) => {
            let keys = Object.keys(row);
            let values = keys.map(() => {
                return "'" + row[key] + "'"
            });
            state.pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb);
        }, cb);
    }, done);
};

database.drop = function(tables, done) {
    if (!state.pool)
        return done(new Error('Missing database connection.'));
    
    async.each(tables, (name, cb) => {
        state.pool.query('DELETE * FROM ' + name, cb);
    }, done)
}

module.exports = database;
