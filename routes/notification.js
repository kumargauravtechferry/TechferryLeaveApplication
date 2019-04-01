var express = require('express');
var router = express.Router();
var isAuth = require('../service/service');

/* GET home page. */
router.get('/',isAuth.isAuthenticated, function(req, res, next) {
    res.render('notifications', {
        title: 'Techferry | Notifications'
    });
});

module.exports = router;