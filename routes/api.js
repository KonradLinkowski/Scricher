const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
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
        res.json({success: false, msg: 'Please pass email and password.'});
        return;
    }
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
            return;
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

// create new post
router.post('/post', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (!getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized"});
    }
    if (!req.body) {
        return res.status(403).send({success: false, msg: "Pass email and message"});
    }
    const post = new Post({
        user: req.user._id,
        message: req.body.message,
        date: new Date()
    });
    post.save((err) => {
        if (err) {
            console.log(err);
            return res.json({success: false, msg: 'Save post failed.'});
        }
        res.json({success: true, msg: 'Succesfuly created a new post.'});

    });
});

//get all posts
router.get('/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    Post.find().populate('user', 'first_name, last_name').exec(function (err, posts) {
        if (err) return next(err);
        res.json(posts);
    });
});

//get posts by id
router.get ('/posts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    Post.findOne({_id: req.params.id}).populate('user', '-_id first_name last_name').exec(function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

//get all users posts
router.get ('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    User.findOne({_id: req.params.id}).populate('posts').exec(function(err, user) {
        if (err) return res.json({success: false, msg: 'Something wrong happened.'});
        res.json(user);
    });
});

// get token out of header
function getToken (headers) {
    if (!headers || !headers.authorization) {
        return null;
    }
    var parted = headers.authorization.split(' ');
    if (parted.length !== 2) {
        return null;
    }
    return parted[1];
};

module.exports = router;