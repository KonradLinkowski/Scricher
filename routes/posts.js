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
        Post.findById(post._id, '-comments -__v')
        .populate('user')
        .exec(function(error, post) {
            if(error) {
                console.log(error);
            return res.json({success: false, msg: 'Save post failed.'});
            }
            res.json(post);
        })

    });
});

//get all posts
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    let query = Util.getQuery(req.query);
    if(query.newest == "Invalid Date" || query.oldest == "Invalid Date") {
        return res.status(400).send({success: false, msg: "Invalid date."});
    }
    Post.find({'date': {$gte: query.oldest.toISOString(), $lt: query.newest.toISOString()}}, '-comments -__v')
    .skip(query.skip).limit(query.skip + query.limit)
    .populate('user', '-__v -last_login -password -posts')
    .sort('-date')
    .exec(function (err, posts) {
        if (err) console.error(err);
        res.json(posts);
    });
});

//get posts by id
router.get ('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    let query = Util.getQuery(req.query);
    Post.findById(req.params.id, {comments: {$slice: [query.skip, query.limit]}},
        '-comments -__v -posts')
        .populate('user', '-posts -last_login -__v -password')
        .exec(function (err, posts) {
        if (err) console.error (err);
        res.json(posts);
    });
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized"});
    }
    Post.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err)
            return res.status(403).send({success: false, msg: err});
        }
        return res.send({success: true, msg: "Post removed."})
    })
})

module.exports = router;