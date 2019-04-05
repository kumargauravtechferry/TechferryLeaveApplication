var express = require('express');
var router = express.Router();
var isAuth = require('../service/service');
var axios = require('axios');
var connection = require('../config/mysqlConnection');
var moment = require("moment");
var fs = require('fs');
const fileUpload = require('express-fileupload');
var busboy = require('connect-busboy');

var multer = require("multer");


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
    //console.log(req.user)
    res.render('dashboard', {
        title: 'Dashboard Page',
        user: req.user,
        userRole: (req.user.RoleId == 1) ? true : false
    });
});

router.post('/', isAuth.isAuthenticated, isAuth.requireRole(2), (req, res, next) => {
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

router.post('/fetchHolidays', isAuth.requireRole(2), (req, res, next) => {
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

router.post('/view-employees', isAuth.requireRole(1), (req, res, next) => {
    //console.log(req.user);

    var connectionCommand = `Select u.UserId, e.EmployeeId, u.FirstName, u.LastName, u.Email, u.ContactNumber, u.Photo,
    u.Photo, e.AvailableLeaves,
    s.StatusName, d.Designation,
    (Select Sum(lt.LeaveValue) from Leaves as l
    inner join LeavesType as lt on l.LeaveTypeId = lt.LeaveTypeId
    where UserId = u.UserId) as TotalLeaves from User as u
    inner join Employee as e on u.EmpId = e.Id
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
            empId
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
    img.onload = function() {
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
router.post('/addEmp', isAuth.isAuthenticated, multer({dest: "./uploads/"}).single("pic"), function (req, res, next) {

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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

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

                //let img_path = `public/images/profile/${image_name}`;

                // picture.mv(img_path, (err3 ) => {
                //     if (err3) {

                //         console.log("image error: " + err3);
                //         connection.rollback(function () {
                //             throw err3;
                //         });
                //     }

                let g = 'M';
                if (gender == "M") {
                    g = 'M';
                } else {
                    g = 'F';
                }
                let userParams = [firstName, lastName, email, password, dob, g, maritalStatus, contactNumber, emergencyNumber, bloodGroup, "../images/profile/", designation];

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

                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }
                            res.send({
                                message: "SUCCESS!!"
                            });
                        });
                    });
                    // });
                });


            });
        });

        // insertIntoAddressAndFetchID(addressParams, (addId) => {

        //     if (addId != null) {
        //         addressId = addId;
        //         insertIntoEmployeeAndFetchID(empParams, (empId) => {

        //             if (empParams != null) {
        //                 employeeId = empId;
        //             }

        //         });
        //     }

        // });

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
router.get('/edit-employee', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res) {
    res.render('edit_employee', {
        title: 'Edit Employees Leaves Page',
        user: req.user,
        userRole: (req.user.RoleId == 1) ? true : false
    });
});

//From HR : Check the details of one user.
router.get('/view-employees/:id', isAuth.isAuthenticated, isAuth.requireRole(1), function (req, res) {
    res.render('dashboard', {
        title: 'View Employees Leaves Previous Page',
        id: req.params.id,
        user: req.user,
        userRole: (req.user.RoleId == 1) ? true : false
    });
});

// //From HR : Check the details of one user.
router.get('/leave', isAuth.isAuthenticated, isAuth.requireRole(2), function (req, res) {

    getLeaveTypeData(null, function (err, result) {
        console.log("resule data " + result)
        res.render('leave', {
            title: 'Log Leaves',
            leaveTypeData: result,
            user: req.user,
            userRole: (req.user.RoleId == 1) ? true : false
        });
    });
    // res.render('leave', {
    //     title: 'View Employees Leaves Previous Page',
    //     id: req.params.id
    // });
});

var getLeaveTypeData = function (params, callbackFn) {

    var leaveTypeData = [];
    connection.query("SELECT * from leavestype", function (err, rows, fields) {
        if (rows.length != 0) {
            leaveTypeData = rows;

        }
        else {
            leaveTypeData = [];
        }

        callbackFn(undefined, leaveTypeData);
    });
};

router.post('/leave', isAuth.requireRole(2), function (req, res) {
//router.post('/leave', function (req, res) {
    _ativityId = 1;
    _activityType = "leave";
    _activityBy = req.user.UserId;
    _activityFor = req.user.UserId; //req.user.employeeId;
    _activityDate = moment(Date.now()).format('YYYY/MM/DD hh:mm:ss') //"2019-04-04 00:00:00"//moment(new Date()).format('YYYY-MM-DD');

    let leavetype = req.body["leave-type"];
    let LeaveDate = req.body.datepickerstart;
    let LeaveReason = req.body.reason;
    let leaveStartDate = req.body.datepickerstart;
    let leaveEndDate = req.body.datepickerend;
    var EndDate = moment(leaveEndDate).format('YYYY-MM-DD');
    var StartDate = moment(leaveStartDate).format('YYYY-MM-DD');
    let UserId = req.user.UserId;
    let CreatedBy = req.user.UserId;
    end = moment(EndDate),
<<<<<<< Updated upstream
        days = end.diff(StartDate, 'days');
    console.log("days calucation" + days);

    for (var i = 1; i <= days; i++) {
        let insertbody = [leavetype, UserId, LeaveReason, moment(LeaveDate).format('YYYY-MM-DD'), CreatedBy];
        let insertQuery = "insert into leaves(LeaveTypeId,UserId,Reason,LeaveDate,CreatedBy) VALUES (?,?,?,?,?)";

        connection.query(insertQuery, insertbody, (err, result) => {
            console.log(err)

            console.log("data inserted" + result);
            res.redirect("/leave")
        });
=======
    days = end.diff(StartDate, 'days');

    var st = new Date(StartDate); //YYYY-MM-DD
    var en= new Date(EndDate); //YYYY-MM-DD
    
    var getDateArray = function(s, e) {
        var arr = new Array();
        var dt = new Date(s);
        while (dt <= e) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }
    
    var dateArr = getDateArray(st, en);

    console.log("start date and end date array "+ dateArr);
   // console.log("days calucation" + days);

   // console.log("details- leavetype-{0},LeaveDate-{1}, LeaveReason -{2},req.body- {3}, req.user -{4} " + leavetype, LeaveDate, LeaveReason, req.body, req.user);
    
    let insertQuery = `insert into leaves(LeaveTypeId,UserId,Reason,LeaveDate,CreatedBy) VALUES`;

    for(let i = 0; i < days; i++){
        let leaveDate = moment(LeaveDate,'YYYY-MM-DD').add(i,'days');
        leaveDate = leaveDate.format('YYYY-MM-DD');
        insertQuery += `(${leavetype}, ${UserId}, '${LeaveReason}', '${leaveDate}', ${CreatedBy})`;
        insertQuery += ((i+1) == days) ? `` : `,`;
>>>>>>> Stashed changes
    }
    insertQuery += `;`;

    console.log(insertQuery);
5
    let insertactivityBody = [_activityType, _activityBy, _activityFor, _activityDate]

    let insertActivityQuery = "insert into activitytable(ActivityType,ActivityBy,ActivityFor,ActivityDate)  VALUES (?,?,?,?)";

    connection.query(insertQuery, (err, result) => {

        connection.query(insertActivityQuery, insertactivityBody, (error, result1) => {
            console.log(error);
            console.log("activity data inserted " + result1);
            res.redirect("/dashboard")
        });
    });
    //res.end()
});

module.exports = router;