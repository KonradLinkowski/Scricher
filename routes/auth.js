const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const validator = require('validator');

// register new account
router.post('/signup', (req, res) => {
    // check if email and password have been passed
    if ((typeof req.body !== undefined && !req.body) || !req.body.password || !req.body.email) {
        return res.status(400).json({success: false, msg: 'Please pass email and password.'});
    }
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({success: false, msg: 'Please pass correct email.'});
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
            return res.status(400).json({success: false, msg: 'Email already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
    });
});

// log in to an account
router.post('/signin', function(req, res) {
    // check if email and password have been passed
    if ((typeof req.body !== undefined && !req.body) || !req.body.password || !req.body.email) {
        return res.status(400).json({success: false, msg: 'Please pass email and password.'});
    }
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({success: false, msg: 'Please pass correct email.'});
    }
    // find user's email in the database
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