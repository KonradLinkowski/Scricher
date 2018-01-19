const mongoose = require('mongoose');
const User = require('../../models/user');
const Post = require('../../models/post');
const Comment = require('../../models/comment')

// Describe our tests
describe('Saving records', function(){

    const myUser = new User({
        first_name: "Jan",
        last_name: "Kowalski",
        password: "TrudneHaslo.pass",
        email: "jankowalski@example.com",
        creation: Date.now(),
        last_login: null
    });

    // Create tests
    it('saves a user to the database', function(done){

        myUser.save((err) => {
            if (err) throw (err);
        }).then(function(){
            expect(myUser.isNew).toBeFalsy();
            User.findOne({email: myUser.email}, (err, user) => {
                if (err) throw err;
                expect(user.first_name).toBe(myUser.first_name);
                expect(user.last_name).toBe(myUser.last_name);
                expect(user.password).toBe(myUser.password);
                expect(user.email).toBe(myUser.email);
                expect(user.creation.toString()).toEqual(myUser.creation.toString());
                done();
            });
        });
    }, 6000);

    it("updates user's last login date", () => {
        User.update({email: myUser.email}, {last_login: Date.now()}, (err, raw) => {
            if (err) console.log(err);
            expect(err).toBeNull();
            expect(raw).not.toBeNull();
        });
    }, 6000);

    it("updates user's last login date correctly", () => {
        var date = new Date();
        User.findOneAndUpdate({email: myUser.email}, {last_login: date}, (err, doc) => {
            if (err) console.log(err);
            expect(err).toBeNull();
            expect(doc.last_login.toString()).toEqual(date.toString());
        });
    }, 6000);

    var post;
    it('saves a post to a database', function(done) {
        post = new Post({
            user: myUser._id,
            message: "Cos tam cos tam",
            date: new Date()
        });
        post.save((err) => {
            if (err) console.log(err);
        }).then(() => {
            expect(post.isNew).toBeFalsy();
            done();
        });
    }, 6000);
    var comment;
    it('adds a comment to the post and saves it to the database', () => {
        comment = new Comment({
            user: myUser._id,
            post: post._id,
            message: "Test test test test.",
        })
        comment.save()
        .then(() => {
            expect(comment.isNew).toBeFalsy();
        })
        .catch(err => {
            console.error(err)
        })
    }, 6000);
});