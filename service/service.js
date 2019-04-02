var connection = require('../config/mysqlConnection');

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  next();
}

function checklogin(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  next();
}


module.exports = { isAuthenticated: isAuthenticated, checklogin: checklogin };
