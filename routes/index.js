var express = require('express');
var router = express.Router();
var isAuth = require('../service/service');
var connection = require('../config/mysqlConnection');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Techferry'
    });
});
router.get('/contact',isAuth.isAuthenticated, function(req, res, next) {
    res.render('contact', {
        title: 'Techferry | Contact'
    });
});
router.get('/notification',isAuth.isAuthenticated, function(req, res, next) {
    res.render('notifications', {
        title: 'Techferry | Notification'
    });
});

// function for logging out a user & if the user is no longer authenticated.

router.get('/logOut', function(req, res, next) {
    // console.log("logOut caled");
   //Get rid of the session token. Then call `logout`; it does no harm.
//    console.log(req.user)
   req.logout();
//    console.log(req.user)
   res.redirect('/login');
});

router.get('/addleave',isAuth.isAuthenticated, function(req, res, next) {
    
    getLeaveTypeData(null, function(err, result){
        res.render('addleave', {
            title: 'Techferry |  Add leave',
            leaveTypeData: result
        });
    });
       

});


var getLeaveTypeData = function(params, callbackFn){
    
    var leaveTypeData = [];
    connection.query("SELECT * from leavestype",function(err, rows, fields){
        if(rows.length != 0){
            leaveTypeData = rows;
            //res.json(data);
        }else{
            leaveTypeData = [];
            //res.json(data);
        }

        callbackFn(undefined, leaveTypeData);
    });
};


var logout = function (req, res, next) {
	
  };

module.exports = router;