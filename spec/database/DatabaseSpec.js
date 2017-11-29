const mongoose = require('mongoose');
const User = require('../../models/user');
const Post = require('../../models/post');

// Describe our tests
describe('Saving records', function(){

    const creationDate = new Date();
    const myUser = new User({
        _id: mongoose.Types.ObjectId(),
        first_name: "Jacek",
        last_name: "Trąba",
        password: "TrudneHaslo",
        email: "jankowalski@mail.com",
        creation: creationDate,
        last_login: null
    });

    // Create tests
    it('saves a user to the database', function(done){
        const user = new User(myUser);
        user.save((err) => {
            if (err) throw (err);
        }).then(function(){
            expect(user.isNew).toBeFalsy();
            expect(user._id).toBe(myUser._id);
            expect(user.first_name).toBe(myUser.first_name);
            expect(user.last_name).toBe(myUser.last_name);
            expect(user.password).not.toBe(myUser.password);
            expect(user.email).toBe(myUser.email);
            expect(user.creation).toBe(myUser.creation);
            done();
        });
    }, 6000);

    it("updates user's last login date", () => {
        User.update({email: myUser.email}, {last_login: new Date()}, (err, raw) => {
            if (err) console.log(err);
            expect(err).toBeNull();
            expect(raw).not.toBeNull();
        });
    }, 6000);

    it("updates user's last login date correctly", () => {
        const loginDate = new Date();
        User.findOneAndUpdate({email: myUser.email}, {last_login: loginDate}, (err, doc) => {
            if (err) console.log(err);
            expect(err).toBeNull();
            expect(doc.creation.toString()).toEqual(creationDate.toString());
            expect(doc.last_login.toString()).toEqual(loginDate.toString());
        });
    }, 6000);

    let myPost = {
        user: myUser._id,
        message: "Cos tam cos tam",
        date: new Date()
    };
    it('saves a post to a database', function(done) {
        post = new Post(myPost);
        post.save((err) => {
            if (err) console.log(err);
        }).then(() => {
            expect(post.isNew).toBeFalsy();
            expect(post.user).toBe(myUser._id);
            expect(post.message).toBe(myPost.message);
            expect(post.date).toBe(myPost.date);
            done();
        });
    }, 6000);
   
    it('adds a comment to the post and saves it to the database', () => {
        let myComment = {
            user: myUser._id,
            message: "Test test test test.",
            date: new Date()};
        post.comments.push(myComment);
        post.save((err) => {
            if (err) console.log(err);
            Post.findById(post._id, (err, res) => {
                expect(res.comments.length).not.toEqual(0);
            });
        });
    }, 6000);
});