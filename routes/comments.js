const router = require('express').Router();
const passport = require('passport');
const Comment = require('../models/comment');
const Post = require('../models/post');
const Util = require('./util');

// get posts's comments
router.get ('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // retrieve token from headers
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    // retrieve query parameterrs
    let query = Util.getQuery(req.query);
    Post.find({'date': {$gte: query.oldest.toISOString(), $lte: query.newest.toISOString()}}).skip(query.skip).limit(query.limit)
        .populate('user', '-comments -last_login -password -posts')
        .populate('comments')
        .exec(function (err, posts) {
        if (err) console.error (err);
        res.json(posts);
    });
    // find post
    Post.findOne({_id: req.params.id}).populate('posts').exec(function(err, user) {
        if (err) return res.json({success: false, msg: 'Something wrong happened.'});
        res.json(user);
    });
});

// create new comment
router.post('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized"});
    }
    if (!req.body) {
        return res.status(403).send({success: false, msg: "Pass message"});
    }
    Post.findById(req.params.id).exec(function(err, post){
        
        if (err) {
            console.error(err);
            return res.status(404).send({success: false, msg: "There isn't such post."});
        }
        const comment = {
            user: req.user._id,
            message: req.body.message,
            date: new Date()
        };
        post.comments.push(comment);
        post.save((err) => {
            if (err) {
                console.error(err);
                return res.json({success: false, msg: 'Saving post failed.'});
            }
            return res.status(201).send({success: true, msg: "Comment created."});
        });
    });
});

module.exports = router;