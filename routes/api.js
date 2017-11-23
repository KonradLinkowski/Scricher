const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

router.post('/signup', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            creation: new Date()
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

router.post('/signin', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user, keys.jwt.jwtKey);
                    // return the information including token as JSON
                    res.json({success: true, token: token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

module.exports = router;