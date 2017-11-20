describe("User model", () => {
    const User = require('../../models/user');
    const db = require("../../config/database-setup");

    db.connect(db.mode.TEST);

    it("should return return one object", () => {
        var error;
        var x = new User().getOneUser(1, (err) => {
            error = err;
        });
        expect(error).toBeUndefined();
    })
});