var connection = require('../config/mysqlConnection');

function isAuthenticated (req, res, next) {
    if(!req.isAuthenticated()){
        return res.redirect('/login');
      }  

      next();
}
module.exports = isAuthenticated;
