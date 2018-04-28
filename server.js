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

// set default utf8
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next()
})

// parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialize passport
app.use(passport.initialize());

// set mongoose promise handling
mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect(keys.mongo.prod_key, {
  useMongoClient: true,
})
.then(result => {
  console.log("Connected to database");
})
.catch(err => {
  console.error(err);
})

// make express use api routes
app.use('/api', require('./routes/api'))

app.get('/', (req, res) => {
  res.end("Aby połączyć się z api, użyj /api.")
});

// run the server
app.listen(port, () => {
  console.log("Server listening at port: " + port);
});