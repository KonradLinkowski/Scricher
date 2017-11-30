const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const api = require('./routes/api');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');

const port = process.env.PORT || 3000;

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongo.test_key, (err) => {
    if (err) console.log(err);
    else console.log("Connected to database");
});

app.use('/api', require('./routes/api'))
/*app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/posts'));
app.use('/api', require('./routes/comments'));*/

app.get('/', (req, res) => {
    res.end("Aby połączyć się z api, użyj /api.")
});

app.listen(port, () => {
    console.log("Server listening at port: " + port);
});