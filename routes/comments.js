const router = require('express').Router();
const passport = require('passport');
const Comment = require('../models/comment');
const Post = require('../models/post');
const Util = require('./util');

// get posts' comments
router.get ('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // retrieve token from headers
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    // retrieve query parameterrs
    let query = Util.getQuery(req.query);

    // find comments
    Comment.find({'post': req.params.id}, '-post, -__v')
    .where('date').gte(query.oldest.toISOString()).lt(query.newest.toISOString())
    .sort('-date')
    .skip(query.skip)
    .limit(query.skip + query.limit)
    .populate('user')
    .exec(function(err, comments) {
        console.log(err)
        if (err) return res.json({success: false, msg: err});
        res.json(comments.reverse());
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
    const newComment = new Comment({
        post: req.params.id,
        user: req.user._id,
        message: req.body.message,
        date: new Date()
    })
    newComment.save(err => {
        if (err) {
            console.log(err)
            return res.json({success: false, msg: 'Save comment failed.'})
        }
        Comment.findById(newComment._id)
        .populate('user')
        .exec(function(err, comment) {
            if (err) {
                console.log(err)
                return res.json({success: false, msg: 'Save comment failed.'})
            }
            res.json(comment);
        })
    })
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (!Util.getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized"});
    }
    Comment.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err)
            return res.status(403).send({success: false, msg: err});
        }
        return res.send({success: true, msg: "Comment removed."})
    })
})

module.exports = router;