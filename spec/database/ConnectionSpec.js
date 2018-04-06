const mongoose = require("mongoose");
const keys = require('../../config/keys');
const User = require('../../models/user');
const Post = require('../../models/post');
const Comment = require('../../models/comment')

mongoose.Promise = global.Promise;
process.on('unhandledRejection', err => console.log(err.stack));
//connect to mongoDB before tests
beforeAll(() => {
  // Connect to mongodb
  mongoose.connect(keys.mongo.test_key, {
    useMongoClient: true
  }).then(() => {
  }, err => {
    console.log("Connection error: ", err);
    expect(err).not.toBeDefined();
  });

  Comment.remove({}, () => {})

  Post.remove({}, () => {});
  
  User.remove({}, () => {});
});
