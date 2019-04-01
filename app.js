var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var mysql = require('mysql');
var passport = require('passport');
var flash=require("connect-flash");
var session = require('express-session');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var loginRouter = require('./routes/login');
var notificationRouter = require('./routes/notification');



var app = express();

// passport, flash, passport-session



app.use(flash());
app.use(session({ secret: "secret" }));

app.use(passport.initialize());
// app.use(flash());

app.use(passport.session());


//We now need to let Express know we'll be using some of its packages:


// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// app.get('/login', function(request, response) {
//     response.render('./login.hbs');
// });


// get dummy json file for user profile
// var fs = require('fs');
// var obj;
// fs.readFile('./profile.json', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
//   console.log("profile information "+ obj.userId);
// });

// app.get('/users.hbs', function(request, response) {

//     if (request.session.loggedin) {
//         response.render('/users.hbs', {
//             username: request.session.username
//         });
//         //response.send('Welcome back, <h1>' +  + '</h1>!');
//     } else {
//         response.send('Please login to view this page!');
//     }
//     response.end();
// });



//#endregion

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/login', loginRouter);
app.use('/notifications', notificationRouter);




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
    res.render('error');
});

module.exports = app;