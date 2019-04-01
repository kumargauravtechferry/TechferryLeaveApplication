var express = require('express');
var router = express.Router();
var isAuth = require('../service/service');

/* GET users listing. */
//For Personal Details
router.get('/', function(req, res, next) {
    // check authentication
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  res.render('dashboard', { title: 'Dashboard Page'});
});

//For Personal Previous Leaves
router.get('/prev',isAuth, function(req, res, next) {
    res.render('previous_leaves', {
        title: 'Previous Leaves Page'
    });
});

//From HR : Check the details/list of other users.
router.get('/view-employees',isAuth, function(req, res, next) {
    res.render('view_employees', {
        title: 'View Employees Leaves Page'
    });
});

//From HR : Check the details of one user.
router.get('/view-employees/:id',isAuth, function(req, res) {
    res.render('edit_employee', {
        title: 'Edit Employees Leaves Page',
        id: req.params.id
    });
});

//From HR : Check the details of one user.
router.get('/view-employees/:id/prev', isAuth,function(req, res) {
    res.render('edit_employee_prev', {
        title: 'View Employees Leaves Previous Page',
        id: req.params.id
    });
});

//From HR : Check the details of one user.
router.get('/leave',isAuth, function(req, res) {
    res.render('leave', {
        title: 'View Employees Leaves Previous Page',
        id: req.params.id
    });
});



module.exports = router;