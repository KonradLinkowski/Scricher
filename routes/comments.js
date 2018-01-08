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
    Comment.find({'post': req.params.id})
    .where('date').gte(query.oldest.toISOString()).lt(query.newest.toISOString())
    .skip(query.skip)
    .limit(query.skip + query.limit)
    .exec(function(err, comment) {
        if (err) return res.json({success: false, msg: err});

        console.log(comment)
        res.json(comment);
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
        res.json({success: true, msg: 'Succesfuly created a new comment.'});
    })
    /*
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
    */
});

module.exports = router;