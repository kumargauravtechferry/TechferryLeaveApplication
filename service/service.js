

function isAuthenticated (req, res, next) {
    if(!req.isAuthenticated()){
        return res.redirect('/login');
      }  

      next();
}

function checklogin (req, res, next) {
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    } 
    next();
}


// function forgotPassword(req, res, next){
//     var email = req.body.email;
//     connection.query("SELECT * FROM `user` WHERE `Email` = '" + email + "'",function(err,rows){
//         if (err)
//             return false;
//         if (!rows.length) {
//             next(err, rows)
//         }
//         else{
//             // generate Token
//             token = crypto.randomBytes(32).toString('hex');
//             console.log(token)
//         } 
        		
    
//     });
// }


module.exports = {isAuthenticated:isAuthenticated,checklogin:checklogin} ;