const mongoose = require('mongoose');
const User = require('../../models/user');
const Post = require('../../models/post');

// Describe our tests
describe('Saving records', function(){

    var myEmail = "jankowalski@mail.com";

    // Create tests
    it('saves a user to the database', function(done){

        let date = new Date();
        const user = new User({
            first_name: "Jacek",
            last_name: "Trąba",
            password: "TrudneHaslo",
            email: myEmail,
            creation: date,
            last_login: null
        });

        user.save((err) => {
            if (err) throw (err);
        }).then(function(){
            expect(user.isNew).toBeFalsy();
            done();
        });
    }, 6000);

    it("updates user's last login date", () => {
        User.update({email: myEmail}, {last_login: new Date()}, (err, raw) => {
            if (err) console.log(err);
            expect(err).toBeNull();
            expect(raw).not.toBeNull();
        });
    }, 6000);

    it("updates user's last login date correctly", () => {
        var date = new Date();
        User.findOneAndUpdate({email: myEmail}, {last_login: date}, (err, doc) => {
            if (err) console.log(err);
            expect(err).toBeNull();
            expect(doc.last_login.toString()).toEqual(date.toString());
        });
    }, 6000);

    var post;
    it('saves a post to a database', function(done) {
        post = new Post({
            user_email: myEmail,
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
   
    it('adds a comment to the post and saves it to the database', () => {
        post.comments.push({user_email: myEmail, message: "Test test test test.", date: new Date()});
        post.save((err) => {
            if (err) console.log(err);
            Post.findById(post._id, (err, res) => {
                expect(res.comments.length).not.toEqual(0);
            });
        });
    }, 6000);
});