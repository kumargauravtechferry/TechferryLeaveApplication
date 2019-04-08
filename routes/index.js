var express = require('express');
var router = express.Router();
var isAuth = require('../service/service');
var connection = require('../config/mysqlConnection');
var  crypto = require('crypto');
var config = require('../config/config');

var smtpTransport = require('../service/nodeMailer')

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    // var userRole = (req.user.RoleId == 1)?true:false ;
    // console.log(userRole)
    res.render('dashboard', { title: 'Dashboard Page' , user: req.user, userRole: (req.user.RoleId == 1)?true:false });
});
router.get('/contact',isAuth.isAuthenticated, function(req, res, next) {
    res.render('contact', {
        title: 'Techferry | Contact',
        user: req.user, userRole: (req.user.RoleId == 1)?true:false
    });
});
router.get('/notification',isAuth.isAuthenticated, function(req, res, next) {
    res.render('notifications', {
        title: 'Techferry | Notification',
        user: req.user, userRole: (req.user.RoleId == 1)?true:false 
    });
});

// function for logging out a user & if the user is no longer authenticated.

router.get('/logOut', function(req, res, next) {
   req.logout();
   res.redirect('/login');
});


// Get Request for FOrgot Password
router.get('/forgotPassword',function(req, res, next){
    var statusMessage = `<span>You have sucessfully change password click this here  for  <a href="/login">login</a></span>`;
    if(req.params.id == 'true'){
    
        res.render('forgotPassword', {title: 'Forgot Password', status_Message_flag: true, statusMessage: statusMessage})
    } 
    else{
        res.render('forgotPassword', {title: 'Forgot Password', status_Message_flag:false, statusMessage: ''})
    }
  
})

router.post('/forgotPassword',function(req, res, next){
    var email = req.body.email;
    connection.query("SELECT * FROM `user` WHERE `Email` = '" + email + "'",function(err,rows){
        if (err)
            return false;
        if (!rows.length) {
            // next(err, rows)
            res.render('forgotPassword',{statusErrorMessage:'User is not exist', statusError: true})
        }
        else{
            // generate Token
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                var name = rows[0].Firstname + ''+ rows[0].Lastname;

                connection.query("UPDATE user SET token= '"+ token +"' WHERE UserId= " + rows[0].UserId + "", function(err, rows){
                    console.log(err)
                    console.log(rows)
                    if(rows.changedRows) {
                        var url  = 'http://localhost:3000/reset_password/' + token;
                        console.log(url+name)
                        var data = {
                            to: email,
                            from: 'rduvedi@techferry.com',
                            template: '../views/email.hbs',
                            subject: 'Password help has arrived!',
                            // context: {
                            //   url: 'http://localhost:3000/reset_password?token=' + token,
                            //   name: 'test'
                            // },
                            html:`<div>
                                    <h3>Dear ${name},</h3>
                                    <p>You requested for a password reset, kindly use this <a href="${url}">link</a> to reset your password</p>
                                    <br>
                                    <p>Cheers!</p>
                                </div>`
                        }
                        smtpTransport.sendMail(data, function(err) {
                            if (!err) {
                                var statusMessage = `<div class="title_message"><h2>Check Your inbox.</h2></div><div class="title_message"><span>We have send password reset instructions into your <label class="email_label">${email}</label> mail id. please Check your Mail.  </span></div>`;
                            //   return res.json({ message: 'Kindly check your email for further instructions' });
                                res.render('forgotPassword', {title: 'Forgot Password', status_Message_flag: true, statusMessage: statusMessage})
                            } else {
                            //   return done(err);
                            console.log(err)
                            }
                            });
                    }
                     else{
                        var statusMessage = ` click here  for  <a href="/login">login</a></span>`;
                        res.render('sucessPage', { status_Message_flag: true, statusMessage: statusMessage})
                     }

                });
            });
        } 
                        
    });

})

router.get('/reset_password/:token',function(req, res, next){
    var token = req.params.token;
    console.log(req.statusMessage)
    connection.query("SELECT * FROM `user` WHERE `token` = '" + token + "'",function(err,rows){
        if (err)
            next(false)
        if (!rows.length) {
            // res.redirect('/login')
            var statusMessage = `<span>Sorry, this link is no longer valid. <p>click here  for</p>  <a href="/login">login</a></span>`;
            res.render('sucessPage', { title: 'Oops! 404 ',status_Message_flag: true, statusMessage: statusMessage})
        } else{
            res.render('reset_password',{url: '/change_password/'+token})
        }
    });

})

function EncryptPassword(password){
    var salt = config.salt;
    var encryptedPass = crypto.pbkdf2Sync(password,  salt, 1000, 64, `sha512`).toString(`hex`); 
    return encryptedPass;
}

router.post('/change_password/:id',function(req,res,next){
    var token = req.params.id;
    if(token == 'reset'){
        if (!req.isAuthenticated()) {
            return res.render('error-page');
        }else{
            var password = req.body.password;
            var old_password = req.body.oldpassword;
            var ency_old_password = EncryptPassword(old_password);
            var enc_password = EncryptPassword(password);
                if (!((req.user.Password).toString() == ency_old_password))
                {
                        res.render('reset_password',{Reset_container: true,statusErrorMessage: 'Wrong passowrd!'})
                } else{
                    connection.query("update `user` set Password = '" + enc_password + "'WHERE `Email` = '" + req.user.Email + "'",function(err,rows){
                        if(!err){
                            // res.send('sucess')
                            res.render('reset_password',{Reset_container: true,statusMessage: 'password changed sucessfully!'})
                        }else{
                            
                            res.render('reset_password',{Reset_container: true,statusErrorMessage: 'please try once!'})
                        }
                        console.log(err)
                    });
                }

        }
        // condition for reset password when user is login 


    } else{
        var password = req.body.password;
        var confirm_password = req.body.Confirm_password;
    
        connection.query("SELECT * FROM `user` WHERE `token` = '" + token + "'",function(err,rows){
            if (err)
                next(false)
                // return done(err);
            if (!rows.length) {
                // return next(err)
                var statusMessage = `<span>Sorry, this link is no longer valid. <p>click here  for</p> <a href="/login">login</a></span>`;
                res.render('sucessPage', {title: 'Oops! 404 ', status_Message_flag: true, statusMessage: statusMessage})
                // return done(null, false, {message:'No User Found.'}); // req.flash is the way to set flashdata using connect-flash
            } else{
                if(password == confirm_password){
                    var encryptPass = EncryptPassword(password);
            
                    connection.query("UPDATE user SET password= '"+ encryptPass +"' WHERE `token` = '" + token + "'",function(err,rows){
                        if (err)
                            // next(false)
                            res.send(err)
                        if (!rows) {
                            return next(err)
                        } else{
                            connection.query("UPDATE user SET token= Null WHERE `token` = '" + token + "'",function(err,rows){
                                if (err)
                                    res.send(err)
                                if (!rows) {
                                    res.redirect('/login')
                                } else{
                                    var statusMessage = `<span>You can now sign in with your new passowrd <p>click here  for </p> <a href="/login">login</a></span>`;
                                    res.render('sucessPage', {title: 'Password Changed!', status_Message_flag: true, statusMessage: statusMessage})
                                }
                            });
                        }
                            
                    
                    });
                } 
                else{
                    console.log('here')
                    // res.send('Passowrd does not match');
                    req.statusMessage = 'false'
                    res.redirect('/reset_password?token='+token)
                //    , statusError:false, statusMessage:'Passowrd does not match'
                }
            }
        });
    }
});

router.get('/change_password/:id',function(req, res, next){
    var token = req.params.id;
    if (token == 'reset'){
        //reset password when user is login
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }else{
            res.render('reset_password',{Reset_container: true,url: '/change_password/reset'})
        }
    }
    else{
        connection.query("SELECT * FROM `user` WHERE `token` = '" + token + "'",function(err,rows){
            if (err) 
                next(false)
                // return done(err);
            if (!rows.length) {
                // return next(err)
                var statusMessage = `<span>Sorry, this link is no longer valid. <p>click here  for</p> <a href="/login">login</a></span>`;
                res.render('sucessPage', { title: 'Oops! 404 ',status_Message_flag: true, statusMessage: statusMessage})
                // return done(null, false, {message:'No User Found.'}); // req.flash is the way to set flashdata using connect-flash
            }
        });
    }
})

// router.get('/change_password', function(req,res,next){

// });

router.get('/sucessPage',function(req, res, next){
    res.render('sucessPage',{title: 'Sucess!', statusMessage: ''} )
})
router.get('/addleave',isAuth.isAuthenticated, function(req, res, next) {
    
    getLeaveTypeData(null, function(err, result){
        res.render('addleave', {
            title: 'Techferry |  Add leave',
            leaveTypeData: result,
            user: req.user, userRole: (req.user.RoleId == 1)?true:false 
        });
    });
});
       


router.post('/addleave',isAuth.requireRole(2), function(req, res) {
    console.log('req.body');
    console.log("user id "+req.user.UserId);
    console.log(req.body);
    let leavetype = req.body["leave-type"];
    let LeaveDate = req.body.datepickerstart;
    let LeaveReason = req.body.reason;
    let leaveStartDate = req.body.datepickerstart;
    let leaveEndDate = req.body.datepickerend;
    let UserId = req.user.UserId;
    let EmpId = req.user.EmpId
    console.log("user info "+req.user);

    let laeveDifference = moment(leaveEndDate).format('YYYY-MM-DD')-moment(leaveStartDate).format('YYYY-MM-DD');
   
    let insertbody = [leavetype,UserId,LeaveReason,moment(LeaveDate).format('YYYY-MM-DD'),EmpId];
    let insertQuery = "insert into leaves(LeaveTypeId,UserId,Reason,LeaveDate,CreatedBy) VALUES (?,?,?,?,?)";

    connection.query(insertQuery, insertbody,(err, result) => {
        console.log(err)
        console.log("data inserted"+result);
    });
    res.end()
});

module.exports = router;