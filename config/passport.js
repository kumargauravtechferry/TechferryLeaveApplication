// config/passport.js
				
var LocalStrategy   = require('passport-local').Strategy;
var passport = require('passport');
var  crypto = require('crypto');
var config = require('./config');

var connection = require('./mysqlConnection');

passport.serializeUser(function(user, done) {
    done(null, user.UserId);
    // done(null, 1);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    var query = `select * from user inner join user_roles on user.UserId = user_roles.UserId where user.UserId = ${id}`
    // console.log(query);
    connection.query(query,function(err,rows){	
        // console.log(rows[0]);
        done(err, rows[0]);
    });
    
    // done(null, 1);
});
	
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    // usernameField : 'email',
    // passwordField : 'password',
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

        connection.query("SELECT * FROM `user` WHERE `Email` = '" + email + "'",function(err,rows){
        if (err)
        return done(err);
        if (!rows.length) {
            return done(null, false, {message:'No User Found.'}); // req.flash is the way to set flashdata using connect-flash
        } 
        
        // get salt
        var salt = config.salt;
        // Encrypt Password given
        var givenEncPass = crypto.pbkdf2Sync(password,  salt, 1000, 64, `sha512`).toString(`hex`);


        // Match encrypted password

        // if the user is found but the password is wrong
        if (!((rows[0].Password).toString() == givenEncPass))
            return done(null, false, {message: 'Oops! Wrong password.'} ); // create the loginMessage and save it to session as flashdata
        
        // all is well, return successful user
        return done(null, rows[0]);			
    
    });
    
    // added by me
    // return done(null, true);			

}));


module.exports = passport;