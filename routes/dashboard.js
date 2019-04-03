var express = require('express');
var router = express.Router();
var isAuth = require('../service/service');
var axios = require('axios');
var connection = require('../config/mysqlConnection');
var moment = require("moment");

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
    //console.log(req.user);
    var connectionCommand = `Select e.EmployeeId, u.Firstname, u.Lastname, u.Email, u.DOB, u.Gender, u.MaritalSatus, u.ContactNumber, u.EmergencyNumber,
    u.BloodGroup, u.Photo, e.JoinedDate, e.AvailableLeaves,
    a.Street1, a.Street2, a.City, a.State, s.StatusName, d.Designation from User as u
    inner join Employee as e on u.EmpId = e.Id
    inner join Address as a on u.AddressId = a.AddressId
    inner join EmployeeStatus as s on e.StatusId = s.StatusId
    inner join Designation as d on u.DesignationId = d.DesignationId
    WHERE u.Email = "${req.user.Email}"`;
    connection.query(connectionCommand, function (err, rows) {
        if (err)
            return res.send(err);
        if (!rows.length) {
            //return done(null, false, req.flash('loginMessage', 'No User Found.')); // req.flash is the way to set flashdata using connect-flash
            return res.send("No Data Found");
        } else {
            return res.send(rows[0]);
        }
    });

});

router.post('/fetchHolidays', (req, res, next) => {
    //console.log(req.user);
    var connectionCommand = `(Select HolidayDate as leaveDate, HolidayName as name, 'holiday' as type from Holidays)
    union all
    (Select LeaveDate as leaveDate, Reason as name, 'leave' as type from Leaves where UserId = ${req.user.UserId});`;
    connection.query(connectionCommand, function (err, rows) {
        if (err)
            return res.send(err);
        if (!rows.length) {
            //return done(null, false, req.flash('loginMessage', 'No User Found.')); // req.flash is the way to set flashdata using connect-flash
            return res.send(null);
        } else {
            return res.send(rows);
        }
    });

});

router.post('/fetchLeaves', (req, res, next) => {
    //console.log(req.user);

    var connectionCommand = `Select l.LeaveDate, lt.LeaveTypeName, lt.LeaveValue, l.Reason from Leaves as l
    inner join LeavesType as lt on l.LeaveTypeId = lt.LeaveTypeId
    inner join user as u on u.UserId = l.UserId
    where email = "${req.user.Email}"`;

    connection.query(connectionCommand, function (err, rows) {
        if (err)
            return res.send(err);
        if (!rows.length) {
            //return done(null, false, req.flash('loginMessage', 'No User Found.')); // req.flash is the way to set flashdata using connect-flash
            return res.send(null);
        } else {
            return res.send(rows);
        }
    });
});

router.post('/view-employees', (req, res, next) => {
    //console.log(req.user);

    var connectionCommand = `Select u.UserId, u.EmpId, u.FirstName, u.LastName, u.Email, u.ContactNumber, u.Photo,
    u.Photo, e.AvailableLeaves,
    s.StatusName, d.Designation,
    (Select Sum(lt.LeaveValue) from Leaves as l
    inner join LeavesType as lt on l.LeaveTypeId = lt.LeaveTypeId
    where UserId = u.UserId) as TotalLeaves from User as u
    inner join Employee as e on u.EmpId = e.EmpId
    inner join EmployeeStatus as s on e.StatusId = s.StatusId
    inner join Designation as d on u.DesignationId = d.DesignationId`;

    connection.query(connectionCommand, function (err, rows) {
        if (err)
            return res.send(err);
        if (!rows.length) {
            //return done(null, false, req.flash('loginMessage', 'No User Found.')); // req.flash is the way to set flashdata using connect-flash
            return res.send(null);
        } else {
            return res.send(rows);
        }
    });

});

//For Personal Previous Leaves
router.get('/prev', isAuth.isAuthenticated, function (req, res, next) {
    res.render('previous_leaves', {
        title: 'Previous Leaves Page'
    });
});

//For Viewing Details
router.post('/viewEmployeeDetails', isAuth.isAuthenticated, function (req, res, next) {
    var userId = req.body.userId;
    res.redirect('/employee-details');
});

//From HR : Check the details/list of other users.
router.get('/view-employees', isAuth.isAuthenticated, function (req, res, next) {
    res.render('view_employees', {
        title: 'View Employees Leaves Page'
    });
});

//From HR : Check the details of one user.
router.get('/employee-details', isAuth.isAuthenticated, function (req, res) {
    res.render('employee-details', {
        title: 'Employees Details',
        id: req.params.id
    });
});

//From HR : Edit the details of one user.
router.get('/edit-employee', isAuth.isAuthenticated, function (req, res) {
    res.render('edit_employee', {
        title: 'Edit Employees Leaves Page',
        
    });
});

//From HR : Check the details of one user.
router.get('/view-employees/:id/prev', isAuth.isAuthenticated, function (req, res) {
    res.render('edit_employee_prev', {
        title: 'View Employees Leaves Previous Page',
        id: req.params.id
    });
});

// //From HR : Check the details of one user.
router.get('/leave', isAuth.isAuthenticated, function (req, res) {
    res.render('leave', {
        title: 'View Employees Leaves Previous Page',
        id: req.params.id
    });
});


// router.get('/addleave', function(req, res) {
//     res.render('addleave', {
//         title: 'Log Leaves'
//     });
// });

var getLeaveTypeData = function(params, callbackFn){

    var leaveTypeData = [];
    connection.query("SELECT * from leavestype",function(err, rows, fields){
        if(rows.length != 0){
            leaveTypeData = rows;
            //res.json(data);
        }else{
            leaveTypeData = [];
            //res.json(data);
        }

        callbackFn(undefined, leaveTypeData);
    });
};

router.get('/addleave',isAuth.isAuthenticated, function(req, res, next) {

    getLeaveTypeData(null, function(err, result){
        res.render('addleave', {
            title: 'Log Leaves',
            leaveTypeData: result
        });
    });
});


router.post('/addleave', function(req, res) {
    console.log('req.body');
    console.log("user id "+req.user.UserId);
    console.log(req.body);
    let leavetype = req.body["leave-type"];
    let LeaveDate = req.body.datepickerstart;
    let LeaveReason = req.body.reason;
    let leaveStartDate = req.body.datepickerstart;
    let leaveEndDate = req.body.datepickerend;
    // let UserId = req.user.UserId;
    // let EmpId = req.user.EmpId
    console.log("user info "+req.user);

    let laeveDifference = moment(leaveEndDate).format('YYYY-MM-DD')-moment(leaveStartDate).format('YYYY-MM-DD');

    let insertbody = [leavetype,LeaveReason,moment(LeaveDate).format('YYYY-MM-DD')];//UserId=,UserId,,EmpId=,CreatedBy
    let insertQuery = "insert into leaves(LeaveTypeId,Reason,LeaveDate) VALUES (?,?,?)";

    connection.query(insertQuery, insertbody,(err, result) => {
        console.log(err)
        console.log("data inserted"+result);
    });
    res.end()

    // res.send("leave apply page.")
});

module.exports = router;