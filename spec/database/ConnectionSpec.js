const mongoose = require("mongoose");
const keys = require('../../config/keys');

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
});
/*
//drop collections before each test
beforeEach(() => {
    
    if(mongoose.connection.collections.users != undefined) {
        mongoose.connection.collections.users.drop(() => {
            done();
        });
    }
    if(mongoose.connection.collection.posts != undefined) {
        mongoose.connection.collection.posts.drop(() => {
            done();
        });
    }
    
});
*/
