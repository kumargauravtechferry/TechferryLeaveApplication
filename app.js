var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/dashboard');
var loginRouter = require('./routes/login');
var notificationRouter = require('./routes/notification');

//#region  login method

// put the credentials to coonect with database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shubhi',
    database: 'world'
});

// Express is what we'll use for our web applications, this includes packages@
//  useful in web development, such as sessions and handling HTTP requests, to initialize it we can do:

var app = express();


//We now need to let Express know we'll be using some of its packages:


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/login', function(request, response) {
    response.render('./login.hbs');
});

// check the user credentials for login

app.post('/auth', function(request, response) {
<<<<<<< Updated upstream
	var userRoleId = "TF-E001";
	var userRoleHRId = "TF-HR001"; 
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.role =userRoleId;
				request.session.loggedin = true;
				request.session.username = username;
				console.log("entered");
				return response.redirect('dashboard');
		response.send('Welcome '+request.session.username +"& userRoleId:- "+userRoleId);
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
=======

    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.send('Welcome ' + request.session.username);
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
>>>>>>> Stashed changes
});


app.get('/users.hbs', function(request, response) {

    if (request.session.loggedin) {
        response.render('/users.hbs', {
            username: request.session.username
        });
        //response.send('Welcome back, <h1>' +  + '</h1>!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});



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
app.use('/dashboard', usersRouter);
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