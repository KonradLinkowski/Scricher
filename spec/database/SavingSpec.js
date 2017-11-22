const mongoose = require('mongoose');
const User = require('../../models/user');
const Post = require('../../models/post');
const keys = require('../../config/keys');

mongoose.Promise = global.Promise;
process.on('unhandledRejection', err => console.log(err.stack));
// Describe our tests
describe('Saving records', function(){

    
    //connect to mongoDB before tests
    // Connect to mongodb
    mongoose.connect(keys.mongo.test_key, {
        userMongoClient: true
    }).then(() => {
        console.log("Connected");
    }, err => {
        console.log(err);
    });

    var id = new mongoose.Types.ObjectId();

  // Create tests
  it('Saves a user to the database', function(done){

    
    let date = new Date();
    const user = new User({
        _id: id,
        first_name: "Jacek",
        last_name: "Trąba",
        email: "jacek@traba.pl",
        creation: date,
        last_login: date
    });

    user.save((err) => {
        if (err) throw (err);
    }).then(function(){
      expect(user.isNew).toBeFalsy();
      done();
    });
  });

    it('saves a post to a database', function(done) {
        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            user_id: id,
            message: "Cos tam cos tam",
            date: new Date()
        });
        post.save((err) => {
            if (err) console.log(err);
        }).then(() => {
            expect(post.isNew).toBeFalsy();
            done();
        });
    });
    
});