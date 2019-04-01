var express = require('express');
var router = express.Router();
var isAuth = require('../service/service');
var axios = require('axios');
var connection = require('../config/mysqlConnection');

/* GET users listing. */
//For Personal Details
router.get('/', function (req, res, next) {
    // check authentication
    // axios.post('/', {user: '01'}).then((res1) => {
    //     return res.send(res1);
    // }).catch((err) => {
    //     console.log('err: ' + err);
    // });
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    //console.log(req.user)
    res.render('dashboard', { title: 'Dashboard Page' });
});

router.post('/', (req, res, next) => {
    console.log(req.user);
    var connectionCommand = `Select * from User as u
    inner join Employee as e on u.EmpId = e.EmpId
    inner join Address as a on u.AddressId = a.AddressId
    inner join EmployeeStatus as s on e.StatusId = s.StatusId
    WHERE u.Email = "${req.user.Email}"`;
    connection.query(connectionCommand, function (err, rows) {
        if (err)
            return res.send(err);
        if (!rows.length) {
            //return done(null, false, req.flash('loginMessage', 'No User Found.')); // req.flash is the way to set flashdata using connect-flash
            return res.send("No Data Found");
        } else{
            return res.send(rows[0]);
        }
    });

});

//For Personal Previous Leaves
router.get('/prev', isAuth.isAuthenticated, function (req, res, next) {
    res.render('previous_leaves', {
        title: 'Previous Leaves Page'
    });
});

//From HR : Check the details/list of other users.
router.get('/view-employees', isAuth.isAuthenticated, function (req, res, next) {
    res.render('view_employees', {
        title: 'View Employees Leaves Page'
    });
});

//From HR : Check the details of one user.
router.get('/view-employees/:id', isAuth.isAuthenticated, function (req, res) {
    res.render('edit_employee', {
        title: 'Edit Employees Leaves Page',
        id: req.params.id
    });
});

//From HR : Check the details of one user.
router.get('/view-employees/:id/prev', isAuth.isAuthenticated, function (req, res) {
    res.render('edit_employee_prev', {
        title: 'View Employees Leaves Previous Page',
        id: req.params.id
    });
});

//From HR : Check the details of one user.
router.get('/leave', isAuth.isAuthenticated, function (req, res) {
    res.render('leave', {
        title: 'View Employees Leaves Previous Page',
        id: req.params.id
    });
});



module.exports = router;