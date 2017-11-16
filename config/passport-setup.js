const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const user = require('../models/user');
const keys = require('./keys')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: keys.jwt.jwtKey
    }, (jwt_payload, done) => {
        user.getUser(jwt_payload.id, (err, user) => {
            if (err) return done(err, false);
            if (user) done(null, user);
            else done(null, false);
        });
    })
);