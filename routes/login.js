
var express = require('express');
var router = express.Router();
var passport = require('../config/passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login Page', message: req.flash('loginMessage') });
});



router.post('/', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return next(err); }

      if (!user) { 
          return res.redirect('/login'); 
        }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        if(user){
            return res.redirect('/dashboard');
        }
      });
    })(req, res, next);
});


module.exports = router;
