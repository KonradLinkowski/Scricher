const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

// register new account
router.post('/signup', (req, res) => {
    if ((typeof req.body !== undefined && !req.body) || !req.body.password || !req.body.email) {
        res.json({success: false, msg: 'Please pass email and password.'});
        return;
    }
    const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
        if (err) {
            return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
    });
});

// log in to an account
router.post('/signin', function(req, res) {
    if ((typeof req.body !== undefined && !req.body) || !req.body.password || !req.body.email) {
        return res.json({success: false, msg: 'Please pass email and password.'});
    }
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            return res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        }
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // if user is found and password is right create a token
                var token = jwt.sign(user.toJSON(), keys.jwt.jwtKey);
                user.last_login = new Date();
                user.save();
                // return the information including token as JSON
                res.json({success: true, token: token});
            } else {
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
        });
    });
});

module.exports = router;