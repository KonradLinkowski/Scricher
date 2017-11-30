const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const Util = require('./util');

//get all users posts
router.get ('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!getToken(req.headers)) {
        return res.status(403).send({success: false, msg: "Unauthorized."});
    }
    let query = Util.getQuery(req.query);
    User.findOne({_id: req.params.id}).populate('posts').exec(function(err, user) {
        if (err) return res.json({success: false, msg: 'Something wrong happened.'});
        res.json(user);
    });
});

module.exports = router;