const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const api = require('./routes/api');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const cors = require('cors')

// set application port
const port = process.env.PORT || 3000;

const app = express();

// allow cors
app.use(cors());
/*
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});
*/

// parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialize passport
app.use(passport.initialize());

// set mongoose promise handling
mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect(keys.mongo.test_key, (err) => {
    if (err) console.log(err);
    else console.log("Connected to database");
});

// make express use api routes
app.use('/api', require('./routes/api'))

app.get('/', (req, res) => {
    res.end("Aby połączyć się z api, użyj /api.")
});

// run the server
app.listen(port, () => {
    console.log("Server listening at port: " + port);
});