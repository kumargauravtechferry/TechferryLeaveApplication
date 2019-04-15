var express = require('express');
var router = express.Router();
var isAuth = require('../service/service');
var axios = require('axios');
var connection = require('../config/mysqlConnection');
var moment = require("moment");
var fs = require('fs');
const fileUpload = require('express-fileupload');
var busboy = require('connect-busboy');
var crypto = require('crypto');
var config = require('../config/config');
var multer = require("multer");
var smtpTransport = require('../service/nodeMailer')


//#region  Define model
let _ativityId;
let _activityType;
let _activityBy;
let _activityFor;
let _activityDate;

//#endregion


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
    console.log('req.user')
    res.render('dashboard', {
        title: 'Dashboard Page',
        user: req.user,
        id: req.user.UserId,
        displayEditText: (req.user.RoleId == 1) ? true : false,
        edit_detail: (req.user.RoleId == 1) ? true : false,
        userRole: (req.user.RoleId == 1) ? true : false,
        buttonText: "Leave Log",
        buttonUrl: "/dashboard/leave"
    });
});

router.post('/', isAuth.isAuthenticated, isAuth.requireRole(2), (req, res, next) => {
    // console.log(req.user);
    var id = req.body.id;
    console.log(id)
    console.log('here')
    var connectionCommand = `Select e.EmployeeId, u.Firstname, u.Lastname, u.Email, u.DOB, u.Gender, u.MaritalSatus, u.ContactNumber, u.EmergencyNumber,
    u.BloodGroup, u.Photo, e.JoinedDate, e.AvailableLeaves,
    a.Street1, a.Street2, a.City, a.State, a.Zip, s.StatusName, d.Designation from User as u
    inner join Employee as e on u.EmpId = e.Id
    inner join Address as a on u.AddressId = a.AddressId
    inner join EmployeeStatus as s on e.StatusId = s.StatusId
    inner join Designation as d on u.DesignationId = d.DesignationId
    WHERE u.UserId = "${id}"`;
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

router.post('/fetchHolidays', isAuth.requireRole(2), (req, res, next) => {
    //console.log(req.user);
    var connectionCommand = `(Select HolidayDate as leaveDate, HolidayName as name, 'holiday' as type from Holidays)
    union all
    (Select LeaveDate as leaveDate, Reason as name, 'leave' as type from Leaves where UserId = ${req.body.id});`;
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

router.post('/holidaysLeave', (req, res, next) => {
    //console.log(req.user);
    var connectionCommand = `(Select HolidayDate as leaveDate, HolidayName as name, 'holiday' as type from Holidays)`;
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

    console.log("URL::::::" + req.originalUrl);

    var connectionCommand = `Select l.LeaveId, l.LeaveDate, lt.LeaveTypeName, lt.LeaveValue, l.Reason from Leaves as l
    inner join LeavesType as lt on l.LeaveTypeId = lt.LeaveTypeId
    inner join user as u on u.UserId = l.UserId
    where u.UserId = "${req.body.id}"
    and MONTH(l.LeaveDate) = MONTH(CURRENT_DATE())
    and YEAR(l.LeaveDate) = YEAR(CURRENT_DATE())`;

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

router.post('/view-employees', isAuth.requireRole(1), (req, res, next) => {
    // console.log(req.user);

    var connectionCommand = `Select u.UserId, e.EmployeeId, u.FirstName, u.LastName, u.Email, u.ContactNumber, u.Photo,
    u.Photo, e.AvailableLeaves,
    s.StatusName, d.Designation,
    (Select Sum(lt.LeaveValue) from Leaves as l
    inner join LeavesType as lt on l.LeaveTypeId = lt.LeaveTypeId
    where UserId = u.UserId) as TotalLeaves from User as u
    inner join Employee as e on u.EmpId = e.Id
    inner join EmployeeStatus as s on e.StatusId = s.StatusId
    inner join Designation as d on u.DesignationId = d.DesignationId
    where u.UserId <> ${req.user.UserId}`;

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
        title: 'Previous Leaves Page',
        user: req.user,
        userRole: (req.user.RoleId == 1) ? true : false
    });
});

//For Viewing Details
router.post('/viewEmployeeDetails', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res, next) {
    var userId = req.body.userId;
    res.redirect('/employee-details');
});

//From HR : Check the details/list of other users.
router.get('/view-employees', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res, next) {
    res.render('view_employees', {
        title: 'View Employees Leaves Page',
        user: req.user,
        userRole: (req.user.RoleId == 1) ? true : false
    });
});

//For Personal Previous Leaves
router.get('/add-employee', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res, next) {


    designation = '';
    status = '';


    //getcurrent date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    //document.getElementById("datefield").setAttribute("max", today);

    connectionPromiseDesignation.then((result) => {
        designation = result;
        return connectionPromiseDStatus;
    }).then((res1) => {
        status = res1;
        return connectionPromiseFetchEmployeeId;
    }).then((res2) => {
        //console.log(res2);
        var empId = "TF-0" + (parseInt(res2) + 1).toString();
        res.render('add-employee', {
            designation,
            status,
            empId,
            today,
            userRole: req.user.RoleId
        });
    }).catch((err) => {
        console.log("error: " + err);
    });


});

router.get('/getDesignation', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res, next) {
    designation = '';
    status = '';

    connectionPromiseDesignation.then((result) => {
        designation = result;
        return connectionPromiseDStatus;
    }).then((res1) => {
        status = res1;
        return connectionPromiseFetchEmployeeId;
    }).then((res2) => {

        res.send({
            designation,
            status

        });
    }).catch((err) => {
        console.log("error: " + err);
    });

});


var connectionPromiseDesignation = new Promise(function (resolve, reject) {
    connection.query(`Select * from Designation`, function (err, rows) {
        if (err) {
            reject(null);
        } else if (!rows.length) {
            reject(null);
        } else {
            resolve(rows);
        }
    });
});

var connectionPromiseDStatus = new Promise(function (resolve, reject) {
    connection.query(`Select * from EmployeeStatus`, function (err, rows) {
        if (err) {
            reject(null);
        } else if (!rows.length) {
            reject(null);
        } else {
            resolve(rows);
        }
    });
});

var connectionPromiseFetchEmployeeId = new Promise(function (resolve, reject) {
    connection.query(`SELECT e.employeeId FROM user as u
    inner join Employee as e on e.id = u.empId
    ORDER BY u.userId DESC LIMIT 1`, function (err, rows) {
            if (err) {
                reject(null);
            } else if (!rows.length) {
                reject(null);
            } else {
                var empId = (rows[0].employeeId).substring(3);
                resolve(empId);
            }
        });
});

function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

//Add Employee Post Request multer({dest: "./uploads/"})
router.post('/addEmp', isAuth.isAuthenticated, multer({
    dest: "./uploads/"
}).single("pic"), function (req, res, next) {

    console.log(JSON.stringify(req.body));

    //User Table Data
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let dob = req.body.dob;
    let gender = req.body.gender;
    let maritalStatus = req.body.maritalStatus;
    let contactNumber = req.body.contactNumber;
    let emergencyNumber = req.body.emergencyNumber;
    let bloodGroup = req.body.bloodGroup;
    let designation = req.body.designation;
    let empId = req.body.employeeId;
    // console.log("Employee ID: " + req.file.toString('base64'));
    // console.log("Employee ID: " + new Buffer(fs.readFileSync(req.file.path)).toString("base64"));
    //let buff = fs.readFileSync(req.body.pic);  
    //let picture = buff.toString('base64');
    let picture = req.body.pic;
    let picUpload = new Buffer(fs.readFileSync(req.file.path)).toString("base64");
    // convertImgToDataURLviaCanvas(picUpload, function(base64Img) {
    //     console.log(base64Img)
    //         });
    // let image_name = req.body.pic;
    // let pic = req.body.pic.substr(req.body.pic.lastIndexOf('\\') + 1).split('.')[1];
    // image_name = empId + '.' + pic;
    let password = Math.floor((Math.random() * 10000000000) + 1).toString(16);
    //Firstname , Lastname ,  Email , Password , DOB , Gender , MaritalSatus , ContactNumber , EmergencyNumber , BloodGroup , Photo

    //Address Table
    let address1 = req.body.address1;
    let address2 = req.body.address2;
    let city = req.body.city;
    let stateslist = req.body.stateslist;
    let zip = req.body.zip;
    let addressParams = [address1, address2, city, stateslist, zip];

    //Employee Table 
    let joiningDate = req.body.joiningDate;
    let availableLeaves = req.body.availableLeaves;
    let status = req.body.status;
    let empParams = [empId, status, joiningDate, availableLeaves];

    let addressId = 0;
    let employeeId = 0;
    let userId = 0;

    connection.beginTransaction(function (err) {
        if (err) {
            throw err;
        }

        connection.query('insert into Address(Street1, Street2, City, State, Zip, UpdatedOn, CreatedOn) VALUES (?,?,?,?,?, now(), now())', addressParams, function (err, result) {
            if (err) {
                connection.rollback(function () {
                    throw err;
                });
            }

            console.log(result);
            addressId = result.insertId;

            connection.query('insert into Employee(EmployeeId, StatusId, JoinedDate, AvailableLeaves, UpdatedOn, CreatedOn) VALUES (?,?,?,?, now(), now())', empParams, function (err1, result1) {
                if (err1) {
                    connection.rollback(function () {
                        throw err1;
                    });
                }

                employeeId = result1.insertId;


                let g = 'M';
                if (gender == "M") {
                    g = 'M';
                } else {
                    g = 'F';
                }

                // passowrd encyption
                var encpassword = isAuth.EncryptPassword(password);

                let userParams = [firstName, lastName, email, encpassword, dob, g, maritalStatus, contactNumber, emergencyNumber, bloodGroup, picUpload, designation];

                // send the player's details to the database
                connection.query(`insert into user(EmpId, AddressId, Firstname , Lastname ,  Email , Password , DOB , Gender , MaritalSatus , ContactNumber , EmergencyNumber , BloodGroup , Photo , UpdatedOn , CreatedOn, DesignationId) VALUES (${employeeId}, ${addressId}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), ?)`, userParams, function (err2, result2) {
                    if (err2) {
                        console.log("error::::" + err2);
                        connection.rollback(function () {
                            throw err2;
                        });
                    }

                    userId = result2.insertId;

                    connection.query('insert into User_Roles(UserId, RoleId, UpdatedOn, CreatedOn) VALUES (?, 2, now(), now())', userId, function (err1, result1) {
                        if (err1) {
                            connection.rollback(function () {
                                throw err1;
                            });
                        }

                        var activityTableEntry = ["Add Employee", req.user.UserId, userId]

                        connection.query('insert into activitytable(ActivityType,ActivityBy,ActivityFor,ActivityDate)  VALUES (?,?,?, now())', activityTableEntry, function (err1, result1) {
                            if (err1) {
                                connection.rollback(function () {
                                    throw err1;
                                });
                            }

                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }
                                var data = {
                                    to: email,
                                    from: 'rduvedi@techferry.com',
                                    template: '../views/email.hbs',
                                    subject: 'Your Account has been created!',
                                    // context: {
                                    //   url: 'http://localhost:3000/reset_password?token=' + token,
                                    //   name: 'test'
                                    // },
                                    html: `<div>
                                            <h3>Dear ${firstName},</h3>
                                            <p>Your account has been created.</p>
                                            <p>Your Login details are</p>
                                            <p>User Email  : ${email}</p>
                                            </p> Password  : ${password}</p>
                                            <br>
                                            <p>Cheers!</p>
                                        </div>`
                                }
                                smtpTransport.sendMail(data, function (err) {
                                    if (!err) {
                                        //     var statusMessage = `<div class="title_message"><h2>Check Your inbox.</h2></div><div class="title_message"><span>We have send password reset instructions into your <label class="email_label">${email}</label> mail id. please Check your Mail.  </span></div>`;
                                        // //   return res.json({ message: 'Kindly check your email for further instructions' });
                                        //     res.render('forgotPassword', {title: 'Forgot Password', status_Message_flag: true, statusMessage: statusMessage})
                                        res.redirect('/dashboard/view-employees');
                                        // res.send({
                                        //     message: "SUCCESS!!"
                                        // });
                                    } else {
                                        //   return done(err);
                                        console.log(err)
                                    }
                                });
                                res.redirect('/dashboard/view-employees');
                                // res.send({
                                //     message: "SUCCESS!!"

                                // });
                            });

                        });
                    });
                });
            });
        });
    });
});



//let stateslist = req.body.stateslist;
insertIntoAddressAndFetchID: (employee, callback) => {

    let insertQuery = "insert into Address(Street1, Street2, City, State, Zip, UpdatedOn, CreatedOn) VALUES (?,?,?,?,?, now(), now()); SELECT LAST_INSERT_ID() as id;";

    connection.query(insertQuery, address, (err, result) => {
        if (err) {
            callback(null);
        } else if (!rows.length) {
            callback(null);
        } else {
            callback(rows[0].id);
        }
    });
}

insertIntoEmployeeAndFetchID: (employee, callback) => {

    let insertQuery = "insert into Employee(EmployeeId, StatusId, JoinedDate, AvailableLeaves, UpdatedOn, CreatedOn) VALUES (?,?,?,?, now(), now()); SELECT LAST_INSERT_ID() as id;";

    connection.query(insertQuery, employee, (err, result) => {
        if (err) {
            callback(null);
        } else if (!rows.length) {
            callback(null);
        } else {
            callback(rows[0].id);
        }
    });
}


//From HR : Check the details of one user.
router.get('/employee-details', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res) {
    res.render('employee-details', {
        title: 'Employees Details',
        id: req.params.id,
        user: req.user,
        userRole: (req.user.RoleId == 1) ? true : false
    });
});

//From HR : Edit the details of one user.
// router.get('/edit-employee', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res) {
//     res.render('edit_employee', {
//         title: 'Edit Employees Leaves Page',
//         user: req.user,
//         userRole: (req.user.RoleId == 1) ? true : false
//     });
// });

//From HR : Check the details of one user.
router.get('/view-employees/:id', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res) {
    res.render('dashboard', {
        title: 'View Employees Leaves Previous Page',
        id: req.params.id,
        user: req.user,
        userRole: req.user.RoleId,
        displayEditText: false,
        edit_detail: (req.user.RoleId == 1) ? true : false,
        //userRole: (req.user.RoleId == 1) ? true : false,
        buttonText: "Edit Employee Details",
        buttonUrl: "/dashboard/view-employees/" + req.params.id + "/edit-employee"
    });
});

router.get('/view-employees/:id/edit-employee', isAuth.requireRole(2), function (req, res) {


    // console.log('req.params.id', req.params.id)
    var connectionCommand = `Select u.UserId, e.EmployeeId, e.StatusId, DATE_FORMAT(e.JoinedDate, "%Y-%m-%d") as JoinedDate, e.AvailableLeaves, u.FirstName, u.LastName, u.Email, u.Gender, u.MaritalSatus, u.BloodGroup, DATE_FORMAT(u.DOB, "%Y-%m-%d") as dob, u.ContactNumber, u.EmergencyNumber, u.Photo, e.AvailableLeaves, s.StatusName, d.Designation, d.DesignationId, a.AddressId, a.Street1, a.Street2, a.City, a.State, a.Zip from User as u inner join Employee as e on u.EmpId = e.Id inner join Address as a on u.AddressId = a.AddressId inner join EmployeeStatus as s on e.StatusId = s.StatusId inner join Designation as d on u.DesignationId = d.DesignationId where u.UserId =${req.params.id}`;
    // res.render('edit-employee', {
    //     id: req.params.id,
    //     user: req.user
    // });
    console.log('req.params.id', req.params.id)
    var connectionCommand = `Select u.UserId, e.EmployeeId, e.StatusId, DATE_FORMAT(e.JoinedDate, "%Y-%m-%d") as JoinedDate, e.AvailableLeaves, u.FirstName, u.LastName, u.Email, u.Gender, u.MaritalSatus, u.BloodGroup, DATE_FORMAT(u.DOB, "%Y-%m-%d") as dob, u.ContactNumber, u.EmergencyNumber, u.Photo, e.AvailableLeaves, s.StatusName, d.Designation, d.DesignationId, a.AddressId, a.Street1, a.Street2, a.City, a.State, a.Zip,  CONCAT(u.FirstName, ' ', u.LastName) AS NAME    from User as u inner join Employee as e on u.EmpId = e.Id inner join Address as a on u.AddressId = a.AddressId inner join EmployeeStatus as s on e.StatusId = s.StatusId inner join Designation as d on u.DesignationId = d.DesignationId where u.UserId = ${req.params.id}`;
    // console.log('connectionCommand', connectionCommand)

    connection.query(connectionCommand, function (err, rows) {
        if (err)
            return res.send(err);
        if (!rows.length) {
            //return done(null, false, req.flash('loginMessage', 'No User Found.')); // req.flash is the way to set flashdata using connect-flash
            return res.send(null);
        } else {
            // return res.send(rows);
            console.log('rows', rows)
            res.render('edit-employee', {
                userDetails: rows[0],
                user: req.user,
                userRole: req.user.RoleId
            });
        }
    });
});

// //From HR : Check the details of one user.
router.get('/leave', isAuth.isAuthenticated, isAuth.requireRole(2), function (req, res) {
    getLeaveTypeData(null, function (err, result) {
        console.log("resule data " + result)
        var leavedata = result;
        getEmployeeIdData(req.user.UserId, function (error, result1) {
            if (error) {
                console.log("error found " + error)
            }
            console.log("result data " + result1)
            var EmpidData = result1
            res.render('leave', {
                title: 'Log Leaves',
                leaveTypeData: leavedata,
                EmpidData: EmpidData,
                user: req.user,
                userRole: (req.user.RoleId == 1) ? true : false,

            });
            console.log("EmpidData ---" + EmpidData);
        });


    });
});
var getLeaveTypeData = function (params, callbackFn) {

    var leaveTypeData = [];
    connection.query("SELECT * from leavestype", function (err, rows, fields) {
        if (rows.length != 0) {
            leaveTypeData = rows;

        } else {
            leaveTypeData = [];
        }

        callbackFn(undefined, leaveTypeData);
    });
};

var getEmployeeIdData = function (param, callbackFn) {
    var EmpidData = [];
    var fetchedRoleId = "";
    var userId = param;

    //var ERoleid = 1 // For Admin/HR role -- Role = 1 for Admin/HR and Role = 2 for Employee

    //fetching the logged-in user employee id
    var getEmpRoleId = `select R.Roleid from user U inner join User_Roles R on U.userid = R.userid where U.userid= ${userId};`
    connection.query(getEmpRoleId, function (err, result) {
        if (err) {
            console.log('err', err)
        }
        else {

            console.log('getting EmpId ==> ', result[0].Roleid);
            fetchedRoleId = parseInt(result[0].Roleid);


            console.log('fetchedEmpId', fetchedRoleId);

            if (fetchedRoleId == 1) {
                var querySearch = "Select CONCAT(u.FirstName, ' ', u.LastName, ' - [',e.EmployeeId,']') AS NAME , e.EmployeeId,u.UserId   from User as u   inner join Employee as e   on u.Empid = e.id left join role r on r.id = u.userid"
                connection.query(querySearch, function (error, rows, columns) {
                    if (error) {
                        return callbackFn(error, null);
                    }
                    else if (rows.length == 0) {
                        return callbackFn("No Row Found", null);
                    }
                    else {
                        return callbackFn(null, rows);
                    }
                });
            } else {

                var querySearch = `Select CONCAT(u.FirstName, ' ', u.LastName, ' - [',e.EmployeeId,']') AS NAME , e.EmployeeId,u.UserId from User as u   inner join Employee as e   on u.Empid = e.id where u.userid =` + userId
                connection.query(querySearch, function (error1, rows1) {
                    console.log("dsknlksd");
                    if (error1) {
                        return callbackFn(error1, null);
                    } else if (rows1.length == 0) {
                        return callbackFn("No Row Found", null);
                    } else {
                        return callbackFn(null, rows1);
                    }
                });
            }
        }

        //callbackFn(null, EmpidData);
    });

};

// router.post('/leave', isAuth.requireRole(2), function (req, res) {
//     _ativityId = 1;
//     _activityType = "leave";
//     _activityBy = req.user.UserId;
//     _activityFor = req.user.UserId; //req.user.employeeId;
//     _activityDate = moment(Date.now()).format('YYYY/MM/DD hh:mm:ss') //"2019-04-04 00:00:00"//moment(new Date()).format('YYYY-MM-DD');
//     //document.getElementById('lblEmpId').textContent
//     console.log("user information " + req.user);
//     let leavetype = req.body["leave-type"];
//     let LeaveDate = req.body.datepickerstart;
//     let LeaveReason = req.body.reason;
//     let leaveStartDate = req.body.datepickerstart;
//     let leaveEndDate = req.body.datepickerend;
//     var EndDate = moment(leaveEndDate).format('YYYY-MM-DD');
//     var StartDate = moment(leaveStartDate).format('YYYY-MM-DD');
//     let UserId = req.user.UserId;
//     let CreatedBy = req.user.UserId;

//     end = moment(EndDate),
//         days = end.diff(StartDate, 'days');
//     console.log("Employee id value " + _activityFor);

//     let leaveScoreValue = 0;
//     let leaveScore = 1; //days

//     switch (parseInt(leavetype)) {
//         case 1:
//             leaveScoreValue = 0.0;
//             break;
//         case 2:
//             leaveScoreValue = 1.0;
//             break;
//         case 3:
//             leaveScoreValue = 0.0;
//             break;
//         case 4:
//             leaveScoreValue = 0.0;
//             break;
//         case 5:
//             leaveScoreValue = 0.5;
//             break;
//         case 6:
//             leaveScoreValue = 0.0;
//     }

//     leaveScore = leaveScore * leaveScoreValue;
//     console.log("leaveScore calucation" + leaveScore);

//     let getUserLeaves = `select AvailableLeaves from employee as e inner join user as u on u.EmpId = e.Id where u.UserId = ${UserId};`;

//     let insertQuery = `insert into leaves(LeaveTypeId, UserId, Reason, LeaveDate, CreatedBy) VALUES `;

//     for (let i = 0; i < days; i++) {
//         let leaveDate = moment(LeaveDate, 'YYYY-MM-DD').add(i, 'days');
//         leaveDate = leaveDate.format('YYYY-MM-DD');
//         insertQuery += `(${leavetype},${UserId}, '${LeaveReason}', '${leaveDate}', ${CreatedBy})                                            `;
//         insertQuery += ((i + 1) == days) ? `` : `, `;
//     }
//     insertQuery += `;`;

//     console.log('insertQuery', insertQuery);
//     let insertactivityBody = [_activityType, _activityBy, _activityFor, _activityDate]

//     let insertActivityQuery = "insert into activitytable(ActivityType,ActivityBy,ActivityFor,ActivityDate)  VALUES (?,?,?,?)";

//     connection.query(getUserLeaves, (err, result1) => {
//         if (err) throw err

//         console.log('get user leave ', result1);

//         // connection.query(insertQuery, (err, result2) => {
//         //     if (err) throw err

//         //     console.log('insert query result ', result2)
//         //     connection.query(insertActivityQuery, insertactivityBody, (error, result3) => {
//         //         console.log(error);
//         //         console.log("activity data inserted " + result3);
//         //         res.redirect("/dashboard")
//         //     });
//         // });
//     });
// });



router.post('/leave', isAuth.requireRole(2), function (req, res) {

    console.log('req', req.body)
    //getting users info
    var userId = req.user.UserId;

    //getting leave info
    //var employeeId = req.body[]
    var empId = parseInt(req.body["Emplid-type"]);
    var leaveStartDate = req.body.datepickerstart;
    var leaveEndDate = req.body.datepickerend;
    var leaveReason = req.body.reason;
    var leaveType1 = req.body["leave-type"];
    var EndDate = moment(leaveEndDate).format('YYYY-MM-DD');
    var StartDate = moment(leaveStartDate).format('YYYY-MM-DD');
    var leaveScoreValue = 0;
    var leaveScore = 0;
    var leaveDate1 = req.body["leaveDate"];
    var leaveDate = [];
    var leaveType = [];

    if (leaveType1.constructor === Array) {
        leaveType = leaveType1;
    } else {
        leaveType.push(leaveType1);
    }

    if (leaveDate1.constructor === Array) {
        leaveDate = leaveDate1;
    } else {
        leaveDate.push(leaveDate1);
    }

    console.log('leaveDate========>', leaveDate);

    var fetchedEmpId = "";
    var applyLeaveforEmp = true;
    var userAvailableLeaves = 0;
    end = moment(EndDate),
        days = end.diff(StartDate, 'days') + 1;


    console.log('days', days);


    for (var i = 0; i < leaveType.length; i++) {
        var type = parseInt(leaveType[i]);

        switch (parseInt(type)) {
            case 1:
                leaveScoreValue = 0.0;
                break;
            case 2:
                leaveScoreValue = 1.0;
                break;
            case 3:
                leaveScoreValue = 0.0;
                break;
            case 4:
                leaveScoreValue = 0.0;
                break;
            case 5:
                leaveScoreValue = 0.5;
                break;
            case 6:
                leaveScoreValue = 0.0;
        }

        leaveScore += leaveScoreValue;
    }

    console.log("leaveScore calculation " + leaveScore);

    //getting activityTable values
    var activityType = "leave";
    var activityBy = userId;
    var activityFor = empId;//0;
    var userIdforAvailableLeave = empId;



    connection.beginTransaction(function (err) {
        if (err) {
            throw err;
        }

        //fetching the logged-in user employee id
        // var getEmpId = `select EmpId from user where UserId = ${userId};`
        // connection.query(getEmpId, [], function (err, result) {
        //     if (err) {
        //         console.log('err', err)
        //         connection.rollback(function () {
        //             throw err;
        //         });
        //     }

        //     console.log('getting EmpId ==> ', result[0].EmpId);
        //     fetchedEmpId = parseInt(result[0].EmpId);


        //     console.log('fetchedEmpId', fetchedEmpId);
        //     //comparing the logged-in user employee id with selected user id.
        //     if (fetchedEmpId == empId) {
        //         applyLeaveforEmp = false;
        //     } else {
        //         empId = fetchedEmpId;
        //     }

        let queryAvailableLeave = `select AvailableLeaves from employee where Id = ${empId}`;
        console.log('queryAvailableLeave', queryAvailableLeave);


        connection.query(queryAvailableLeave, [], function (err1, result1) {
            if (err1) {
                console.log('err1', err1)
                connection.rollback(function () {
                    throw err1;
                });
            }


            console.log('result for AvailableLeaves', result1);

            userAvailableLeaves = parseFloat(result1[0].AvailableLeaves);

            console.log('userAvailableLeaves', userAvailableLeaves);
            //checking whether applied leave is not greater than available leave
            if (userAvailableLeaves < leaveScore) {
                // error
            }
            else {

                // if (applyLeaveforEmp) {
                //     //getting userId for applied leave
                //     connection.query('select UserId from employee as e inner join user as u on u.EmpId = e.Id where e.EmployeeId = ' + empId, function (error, rows, columns) {
                //         if (error) {
                //             console.log('error', error)
                //             connection.rollback(function () {
                //                 throw error;
                //             });
                //         }
                //         activityFor = rows[0].UserId;

                //         userIdforAvailableLeave = activityFor;

                //     });
                // }

                let insertQuery = `insert into leaves(LeaveTypeId, UserId, Reason, LeaveDate, CreatedBy,UpdatedOn,CreatedOn) VALUES `;
                for (let i = 0; i < leaveDate.length; i++) {
                    let leaveDateq = moment(leaveDate[i], 'YYYY-MM-DD');
                    leaveDateq = leaveDateq.format('YYYY-MM-DD');

                    insertQuery += `(${leaveType[i]},${empId}, '${leaveReason}', '${leaveDateq}', ${userId}, now(), now())`;
                    insertQuery += ((i + 1) == leaveDate.length) ? `` : `, `;
                }
                insertQuery += `;`;

                console.log('insertQuery', insertQuery);

                var leftAvailableLeave = userAvailableLeaves - leaveScore;
                let insertActivityQuery = `insert into activitytable(ActivityType,ActivityBy,ActivityFor,ActivityDate)  VALUES ('${activityType}', ${activityBy} , ${activityFor} , now())`;

                let updateAvailableLeaves = `update employee inner join user on user.EmpId = employee.Id set AvailableLeaves = ${leftAvailableLeave} where user.UserId = ${userIdforAvailableLeave}`;

                console.log('insertActivityQuery', insertActivityQuery);
                console.log('updateAvailableLeaves', updateAvailableLeaves);


                connection.query(insertQuery, [], function (err1, result1) {
                    if (err1) {
                        console.log('err1', err1)
                        connection.rollback(function () {
                            throw err1;
                        });
                    }

                    connection.query(insertActivityQuery, [], function (err1, result1) {
                        if (err1) {
                            console.log('err1', err1)
                            connection.rollback(function () {
                                throw err1;
                            });
                        }

                        connection.query(updateAvailableLeaves, [], function (err1, result1) {
                            if (err1) {
                                console.log('err1', err1)
                                connection.rollback(function () {
                                    throw err1;
                                });
                            }

                            connection.commit(function (err) {
                                if (err) {
                                    console.log('err commit', err)
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }


                                res.redirect("/dashboard");
                            });
                        });
                    });
                });

            } // end of else
        });
    });
});

// checking whether the leave is log for self or another user

// //getching the logged-in user employee id
// var getEmpId = `select EmpId from user where UserId = ${userId};`
// connection.query(getEmpId, function (error, rows, columns) {
//     if (error) throw error

//     // console.log('result for Employee Id', rows);

//     fetchedEmpId = parseInt(rows[0].EmpId);
// });

// console.log('fetchedEmpId', fetchedEmpId);
// //comparing the logged-in user employee id with selected user id.
// if (fetchedEmpId == empId) {
//     applyLeaveforEmp = false;
// } else {
//     empId = fetchedEmpId;
// }

// //getting the selected user's available leaves
// let queryAvailableLeave = `select AvailableLeaves from employee where EmployeeId = ${empId}`;
// console.log('queryAvailableLeave', queryAvailableLeave);
// connection.query(queryAvailableLeave, function (error, rows, columns) {
//     if (error) throw error

//     console.log('result for AvailableLeaves', rows);

//     userAvailableLeaves = rows[0].AvailableLeaves;
// });

// console.log('userAvailableLeaves', userAvailableLeaves);
// //checking whether applied leave is not greater than available leave
// if (userAvailableLeaves > leaveScore) {
//     // error
// } else {



//     if (applyLeaveforEmp) {
//         //getting userId for applied leave
//         connection.query('select UserId from employee as e inner join user as u on u.EmpId = e.Id where e.EmployeeId = ' + empId, function (error, rows, columns) {

//             // console.log('result for AvailableLeaves', rows);

//             activityFor = rows[0].UserId;

//             userIdforAvailableLeave = activityFor;
//         });
//     }


//     let insertQuery = `insert into leaves(LeaveTypeId, UserId, Reason, LeaveDate, CreatedBy) VALUES `;
//     for (let i = 0; i < days; i++) {
//         let leaveDate = moment(leaveStartDate, 'YYYY-MM-DD').add(i, 'days');
//         leaveDate = leaveDate.format('YYYY-MM-DD');
//         insertQuery += `(${leaveType},${userIdforAvailableLeave}, '${leaveReason}', '${leaveDate}', ${userId})                                            `;
//         insertQuery += ((i + 1) == days) ? `` : `, `;
//     }
//     insertQuery += `;`;

//     console.log('insertQuery', insertQuery);

//     var leftAvailableLeave = userAvailableLeaves - leaveScore;
//     let insertActivityQuery = `insert into activitytable(ActivityType,ActivityBy,ActivityFor,ActivityDate)  VALUES ('${activityType}', ${activityBy} , ${activityFor} , now())`;

//     let updateAvailableLeaves = `update employee inner join user on user.EmpId = employee.Id set AvailableLeaves = ${leftAvailableLeave} where user.UserId = ${userIdforAvailableLeave}`;

//     console.log('insertActivityQuery', insertActivityQuery);
//     console.log('updateAvailableLeaves', updateAvailableLeaves);
//     connection.beginTransaction(function (err) {
//         if (err) {
//             throw err;
//         }

//         connection.query(insertQuery, [], function (err, result) {
//             if (err) {
//                 console.log('err', err)
//                 connection.rollback(function () {
//                     throw err;
//                 });
//             }

//             connection.query(insertActivityQuery, [], function (err1, result1) {
//                 if (err1) {
//                     console.log('err1', err1)
//                     connection.rollback(function () {
//                         throw err1;
//                     });
//                 }

//                 // send the player's details to the database
//                 connection.query(updateAvailableLeaves, [], function (err2, result2) {
//                     if (err2) {

//                         console.log("error::::" + err2);
//                         connection.rollback(function () {
//                             throw err2;
//                         });
//                     }

//                     connection.commit(function (err) {
//                         if (err) {
//                             console.log('err commit', err)
//                             connection.rollback(function () {
//                                 throw err;
//                             });
//                         }
//                     });
//                 });
//             });
//         });
//     });

//     // connection.query(insertQuery, (err, result1) => {
//     //     if (err) throw err

//     //     console.log('insert query result ', result1)
//     //     connection.query(insertActivityQuery, insertactivityBody, (error, result2) => {
//     //         if (error) throw error
//     //         console.log(error);
//     //         console.log("activity data inserted " + result2);
//     //         // res.redirect("/dashboard")
//     //         connection.query(updateAvailableLeaves, insertactivityBody, (error, result3) => {
//     //             if (error) throw error
//     //             console.log("update user available leaves " + result3);
//     //             res.redirect("/dashboard");
//     //         });
//     //     });
//     // });

// } //end of else


//});


router.get('/edit-employee', isAuth.requireRole(2), function (req, res) {

    connection.query(`Select u.UserId, e.EmployeeId, e.StatusId, DATE_FORMAT(e.JoinedDate, "%Y-%m-%d") as JoinedDate, e.AvailableLeaves, u.FirstName, u.LastName, u.Email, u.Gender, u.MaritalSatus, u.BloodGroup, DATE_FORMAT(u.DOB, "%Y-%m-%d") as dob, u.ContactNumber, u.EmergencyNumber, u.Photo, e.AvailableLeaves, s.StatusName, d.Designation, d.DesignationId, a.AddressId, a.Street1, a.Street2, a.City, a.State, a.Zip,  CONCAT(u.FirstName, ' ', u.LastName , ' [',e.EmployeeId,']') AS NAME    from User as u inner join Employee as e on u.EmpId = e.Id inner join Address as a on u.AddressId = a.AddressId inner join EmployeeStatus as s on e.StatusId = s.StatusId inner join Designation as d on u.DesignationId = d.DesignationId where u.UserId= ` + req.user.RoleId, function (error, rows, columns) {
        if (error) throw error

        // if user not found
        if (rows.length <= 0) {
            req.flash('error ', 'user not found with userId= ' + req.user.userId)
            res.redirect('/dashboard')
        } else {
            // if user found
            // render to dashboard/edit_employee template file
            res.render('edit_employee', {
                userRole: (req.user.RoleId == 1) ? true : false,
                id: rows[0].UserId,
                Firstname: rows[0].FirstName,
                Lastname: rows[0].LastName,
                Email: rows[0].Email,
                AddressId: rows[0].AddressId,
                DOB: rows[0].dob,
                Gender: rows[0].Gender,
                MaritalStatus: rows[0].MaritalSatus,
                ContactNumber: rows[0].ContactNumber,
                EmergencyNumber: rows[0].EmergencyNumber,
                BloodGroup: rows[0].BloodGroup,
                Photo: rows[0].Photo,
                // token: JoinedDateows[0].token,
                DesignationId: rows[0].DesignationId,
                First_lastName: rows[0].NAME,
                Street1: rows[0].Street1,
                Street2: rows[0].Street2,
                City: rows[0].City,
                State: rows[0].State,
                Zip: rows[0].Zip,
                JoinedDate: rows[0].JoinedDate,
                EmployeeId: rows[0].EmployeeId

            });
        };
    });

});


//Update Employee Post Request multer({dest: "./uploads/"})
router.post('/updateEmp', isAuth.isAuthenticated, multer({
    dest: "./uploads/",
    limits: { fieldSize: 25 * 1024 * 1024 }
}).single("pic"), function (req, res, next) {

    //console.log(JSON.stringify(req.body));

    //User Table Data
    let userId = req.user.UserId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let dob = req.body.dob;
    let gender = req.body.gender;
    let maritalStatus = req.body.maritalStatus;
    let contactNumber = req.body.contactNumber;
    let emergencyNumber = req.body.emergencyNumber;
    let bloodGroup = req.body.bloodGroup;
    let designation = req.body.designation;

    let g = 'M';
    if (gender == "M") {
        g = 'M';
    } else {
        g = 'F';
    }

    let picture = req.file;
    let picUpload;
    //console.log('picture', picture)
    if (picture === undefined || picture == {}) {
        picUpload = req.body.userImg;
    } else {
        picUpload = new Buffer(fs.readFileSync(req.file.path)).toString("base64");
    }

    //Address Table
    let address1 = req.body.address1;
    let address2 = req.body.address2;
    let city = req.body.city;
    let stateslist = req.body.stateslist;
    let zip = req.body.zip;
    //Employee Table 
    let joiningDate = req.body.joiningDate;
    let availableLeaves = req.body.availableLeaves;
    let status = req.body.status;


    connection.beginTransaction(function (err) {
        if (err) {
            throw err;
        }

        var query = `update user set Firstname =  '${firstName}'  , Lastname = '${lastName}' , Email = '${email}',  DOB  = '${dob}', Gender = '${g}' , MaritalSatus = '${maritalStatus}' , ContactNumber = '${contactNumber}' , EmergencyNumber = '${emergencyNumber}', BloodGroup = '${bloodGroup}', Photo = '${picUpload}', UpdatedOn = now(), DesignationId = ${designation} WHERE UserId =${userId} `;
        //console.log('query', query);
        connection.query(query, [], function (err, result) {
            if (err) {
                console.log('err', err)
                connection.rollback(function () {
                    throw err;
                });
            }
            // console.log('user details', result);
            // addressId = result.insertId;
            var query2 = `update Employee  
                            inner join user on user.EmpId = Employee.Id
                            set Employee.StatusId = ${status}, Employee.JoinedDate = '${joiningDate}' , Employee.AvailableLeaves = ${availableLeaves}, Employee.UpdatedOn = now() where user.UserId = ${userId}`;

            //console.log('query2', query2)

            connection.query(query2, [], function (err1, result1) {
                if (err1) {
                    console.log('err1', err1)
                    connection.rollback(function () {
                        throw err1;
                    });
                }

                var query3 = `update Address 
                 inner join user on user.EmpId = Address.AddressId  
                 set Address.Street1 = '${address1}', Address.Street2 = '${address2}', Address.City = '${city}', Address.State = '${stateslist}', Address.Zip = ${zip}, Address.UpdatedOn = now() where user.UserId = ${userId}`;

                //console.log('query3', query3);
                // send the player's details to the database
                connection.query(query3, [], function (err2, result2) {
                    if (err2) {

                        console.log("error::::" + err2);
                        connection.rollback(function () {
                            throw err2;
                        });
                    }

                    // userId = result2.insertId;

                    connection.commit(function (err) {
                        if (err) {
                            console.log('err commit', err)
                            connection.rollback(function () {
                                throw err;
                            });
                        }
                        res.render('dashboard/edit-employee', {
                            title: 'User Updated',
                            user: req.body.userinfo,
                            userRole: req.user.RoleId
                        });
                    });
                });
            });
        });
    });
});

router.get('/fetchLeaveTypes', isAuth.requireRole(2), function (req, res, next) {
    connection.query(`SELECT * FROM LeavesType`, function (err, rows) {
        if (err) {
            console.log("Error: " + err);
            return res.send(null);
        } else if (rows.length == 0) {
            console.log("No row found!");
            return res.send(null);
        } else {
            console.log(rows);
            return res.send(rows);
        }
    });
});


//Update the leave by HR
router.post('/updateLeave', isAuth.requireRole(2), function (req, res, next) {

    console.log(JSON.stringify(req.body));

    var leaveTableId = req.body.leaveTableId;
    var userid = req.user.UserId;

    console.log(leaveTableId);



    connection.beginTransaction(function (err) {
        if (err) {
            throw err;
        }

        var leaveArray = [req.body.leaveDate, userid, req.body.leaveReason, req.body.leaveType, req.body.leaveTableId];

        connection.query(`UPDATE Leaves SET LeaveDate = ?, UpdatedBy = ?, UpdatedOn = now(), Reason = ?, LeaveTypeId = ? where LeaveId = ?`, leaveArray, function (err, result) {
            if (err) {
                connection.rollback(function () {
                    console.log(err);
                    throw err;
                });
            }

            connection.query(`UPDATE Employee SET AvailableLeaves = AvailableLeaves + ${req.body.leaveOldValue} - (Select LeaveValue from LeavesType where LeaveTypeId = ${req.body.leaveType}) WHERE Id = (Select EmpId from User where UserId = ${req.body.id})`, function (err2, result2) {
                if (err2) {
                    connection.rollback(function () {
                        console.log(err2);
                        throw err2;
                    });
                }

                var activityArray = ["Update Leave", userid, req.body.id]

                connection.query(`insert into activitytable(ActivityType,ActivityBy,ActivityFor,ActivityDate)  VALUES (?,?,?, now())`, activityArray, function (err3, result3) {
                    if (err3) {
                        connection.rollback(function () {
                            console.log(err3);
                            throw err3;
                        });
                    }

                    connection.commit(function (err4) {
                        if (err4) {
                            connection.rollback(function () {
                                throw err4;
                            });
                        }

                        return res.send(true);

                    });

                });

            });
        });
    });

});

//Update the leave by HR
router.post('/deleteLeave', isAuth.requireRole(2), function (req, res, next) {

    console.log(JSON.stringify(req.body));

    var leaveTableId = req.body.leaveTableId;
    var userid = req.user.UserId;
    var id = req.body.id;
    var leaveDate = req.body.leaveDate;
    var leaveReason = req.body.leaveReason;
    var leaveValue = req.body.leaveValue;

    console.log(leaveTableId);

    connection.beginTransaction(function (err) {
        if (err) {
            throw err;
        }

        var leaveArray = [req.body.leaveDate, req.body.id, req.body.leaveReason, req.body.leaveType, req.body.leaveTableId];

        connection.query(`DELETE FROM Leaves where LeaveId = ${leaveTableId} `, function (err, result) {
            if (err) {
                connection.rollback(function () {
                    console.log(err);
                    throw err;
                });
            }

            connection.query(`UPDATE Employee SET AvailableLeaves = AvailableLeaves + ${req.body.leaveValue} WHERE Id = (Select EmpId from User where UserId = ${req.body.id})`, function (err2, result2) {
                if (err2) {
                    connection.rollback(function () {
                        console.log(err2);
                        throw err2;
                    });
                }

                var activityArray = ["Delete Leave", userid, req.body.id]

                connection.query(`insert into activitytable(ActivityType,ActivityBy,ActivityFor,ActivityDate)  VALUES (?,?,?, now())`, activityArray, function (err3, result3) {
                    if (err3) {
                        connection.rollback(function () {
                            console.log(err3);
                            throw err3;
                        });
                    }

                    connection.commit(function (err4) {
                        if (err4) {
                            connection.rollback(function () {
                                throw err4;
                            });
                        }
                        return res.send(true);

                    });

                });

            });
        });
    });

});

module.exports = router;