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

function requireRole (role) {
  return function (req, res, next) {
      if (req.user && ((req.user.RoleId == 1) || (req.user.RoleId === role))) {
          next();
      } else {
          res.render('error-page');
      }
  }
}


module.exports = { isAuthenticated: isAuthenticated, checklogin: checklogin, requireRole:requireRole };
