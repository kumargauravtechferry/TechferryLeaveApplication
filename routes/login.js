var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('login', { title: 'Login Page' });
});

router.post('/', function (req, res, next) {
    res.send('Login Post req.');
});

module.exports = router;
