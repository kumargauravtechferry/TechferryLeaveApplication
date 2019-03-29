var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Techferry'
    });
});
router.get('/contact', function(req, res, next) {
    res.render('contact', {
        title: 'Techferry | Contact'
    });
});
router.get('/notification', function(req, res, next) {
    res.render('notifications', {
        title: 'Techferry | Notification'
    });
});
<<<<<<< Updated upstream

// function for logging out a user & if the user is no longer authenticated.

router.get('/logOut', function(req, res, next) {
    console.log("logOut caled");
   //Get rid of the session token. Then call `logout`; it does no harm.
	req.logout();
	req.session.destroy(function (err) {
	  if (err) { return next(err); }
	  // The response should indicate that the user is no longer authenticated.
	  return res.send({ authenticated: req.isAuthenticated() });
	});
});

var logout = function (req, res, next) {
	
  };

=======
>>>>>>> Stashed changes
module.exports = router;