var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs  = require("ejs");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('views'));

//配置ejs视图的目录
app.set("views", __dirname + "/views");    //    '/views代表存放视图的目录
app.set('view engine', 'html')
app.engine('html',ejs.__express)


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
