const router = require('express').Router();
const passport = require('passport');
const Post = require('../models/post');
const Util = require('./util');

// create new post
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (!Util.getToken(req.headers)) {
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
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    let query = Util.getQuery(req.query);
    Post.find({'date': {$gte: query.oldest.toISOString(), $lte: query.newest.toISOString()}}).skip(query.skip).limit(query.limit)
        .populate('user', '-comments -last_login -password -posts').exec(function (err, posts) {
        if (err) console.error (err);
        res.json(posts);
    });
});

//get posts by id
router.get ('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    let query = Util.getQuery(req.query);
    Post.findById(req.params.id, {comments: {$slice: [query.skip, query.limit]}}, '-comments -__v -posts')
        .populate('user', '-posts -last_login -__v -password')
        .exec(function (err, posts) {
        if (err) console.error (err);
        res.json(posts);
    });
});

module.exports = router;