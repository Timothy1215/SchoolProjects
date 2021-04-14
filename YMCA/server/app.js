var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');

var app = express();

/////////////// CONNECT TO MAIN DATA STORAGE /////////////////////////
let mongoose = require('mongoose');
let connectionString = 'mongodb://localhost:27017/ymca';
mongoose.connect( connectionString, { useNewUrlParser : true } );

//////////////////////////////////////////////////////////////////////

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/////////////// SESSION MANAGEMENT ///////////////////////////////////
var MongoDBStore = require('connect-mongodb-session')(session);

let mongoSessionStore = new MongoDBStore({
  uri : 'mongodb://localhost:27017/ymca',
  collection : 'sessions'
});

app.use(session({
  secret : 'cnuaos@10#22cna',
  resave : true,
  saveUninitialized : false,
  cookie : {
    httpOnly : true,
    secure : false,
    sameSite : false,
    maxAge : 600000
  },
  name : 'sid',
  rolling : true,
  store : mongoSessionStore
}));

//////////////////////////////////////////////////////////////////////

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
