const router = require('express').Router();
const passport = require('passport');
const Comment = require('../models/comment')
const User = require('../models/user');
const Post = require('../models/post');
const Util = require('./util');

//get all users posts
router.get ('/posts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    let query = Util.getQuery(req.query);
    Post.find({'user': req.params.id}, '-post, -__v')
    .where('date').gte(query.oldest.toISOString()).lt(query.newest.toISOString())
    .sort('-date')
    .skip(query.skip)
    .limit(query.skip + query.limit)
    .exec(function(err, posts) {
        if (err) {
            console.log(err)
            return res.json({success: false, msg: err});
        }
        res.json(posts);
    });
    /*
    User.findOne({_id: req.params.id}).populate('posts').exec(function(err, user) {
        if (err) return res.json({success: false, msg: 'Something wrong happened.'});
        res.json(user);
    });
    */
});

router.get ('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    User.findById(req.params.id)
    .exec(function(err, user) {
        if (err) {
            console.log(err)
            return res.json({success: false, msg: err});
        }
        console.log(user)
        res.json(user);
    });
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    console.log(req.user)
    console.log(req.user.role !== Util.userRoles.ADMIN && req.user._id != req.params.id)
    if (req.user.role !== Util.userRoles.ADMIN && req.user._id != req.params.id) {
        return res.status(403).send({success: false, msg: "Forbidden."});
    }
    Comment.remove({user: req.params.id})
    .exec(function(err) {
        console.log(err)
    })
    Post.remove({user: req.params.id})
    .exec(function(err) {
        console.log(err)
    })
    User.findByIdAndRemove(req.params.id)
    .exec(function(err, user) {
        if (err) {
            console.log(err)
            return res.json({success: false, msg: err});
        }
        console.log("deleted", user)
        res.json(user);
    });
})

module.exports = router;