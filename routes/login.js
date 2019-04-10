
var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var isAuth = require('../service/service');

/* GET home page. */
router.get('/', isAuth.checklogin,function(req, res, next) {
  // console.log(req.session)
  var message = '';
  if(req.session.flash){
    if(req.session.flash.status_Message){
      var length = req.session.flash.status_Message.length

      message = req.session.flash.status_Message[length - 1];
    }

     req.flash('status_Message','');
  }
  res.render('login', { title: 'login Page', message: message});
});



router.post('/', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return next(err); }
      if(info){
        req.flash('status_Message', info.message);
      }
      if (!user) { 
        console.log(info.message)
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
