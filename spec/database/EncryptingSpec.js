const mongoose = require('mongoose');
const User = require('../../models/user');

// Describe our tests
describe('UserSchema.pre()', function(){

    var myPassword = "trudne haslo";
    it('hashes users password', function(done) {
        const user = new User({
            first_name: "Jan",
            last_name: "Kowalski",
            email: "email@gmail.com",
            password: myPassword,
            creation: new Date()
        });
        user.save(function(err) {
            if (err) console.log(err);
            expect(user.password).not.toEqual(myPassword);
            user.comparePassword(myPassword, function(err, isMatch) {
                expect(isMatch).toBeTruthy();
            });
            done();
        });
    });

});