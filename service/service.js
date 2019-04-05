var connection = require('../config/mysqlConnection');
var  crypto = require('crypto');
var config = require('../config/config');

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

function EncryptPassword(password){
  var salt = config.salt;
  var encryptedPass = crypto.pbkdf2Sync(password,  salt, 1000, 64, `sha512`).toString(`hex`); 
  return encryptedPass;
}


module.exports = { isAuthenticated: isAuthenticated, checklogin: checklogin, requireRole:requireRole,EncryptPassword:EncryptPassword };
