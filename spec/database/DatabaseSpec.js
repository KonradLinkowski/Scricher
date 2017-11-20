describe("Database connection", () => {
    const db = require("../../config/database-setup");

    it("should connect to the database", () => {
        var error;
        db.connect(db.mode.TEST);
        db.get().getConnection((err, connection) => {
            error = err;
        });
        expect(error).not.toBeDefined();
        expect(db.get()).toBeDefined();
        expect(db.get()).not.toBeNull();
    });

    it("should return some users", () => {
        db.get().query("INSERT INTO Users(email, password, creation, last_login) VALUES (??, ??, ??, ??)",
            ["test@test.pl", "testest", new Date().toISOString, new Date().toISOString], (err) => {
            if (err) throw err;
            });
        var result;
        var error;
        db.get().query("SELECT * FROM Users", (err, rows, fields) => {
            error = err;
            result = rows;
        });
        expect(error).not.toBeDefined();
        expect(result).toBeDefined();

    });
});