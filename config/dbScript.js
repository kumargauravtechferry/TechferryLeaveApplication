drop database leaveapp;

create database leaveapp;

use leaveapp;
/* Address table consists of address details */
CREATE TABLE Address(
    AddressId INT(10) AUTO_INCREMENT PRIMARY KEY,
    Street1 varchar(200),
    Street2 varchar(200),
    City varchar(200),
    State varchar(200),
    Zip int(10),
    UpdatedOn datetime,
    CreatedOn datetime
);

/* basic user table containing the user's basic info */
CREATE TABLE User (
    UserId INT(10) AUTO_INCREMENT PRIMARY KEY,
    EmpId INT(10) Unique,
    Firstname VARCHAR(30) NOT NULL,
    Lastname VARCHAR(30) NOT NULL,
    Email VARCHAR(100) UNIQUE ,
    Password varchar(255),
    AddressId INT(10) NOT NULL,
    DOB datetime,
    Gender CHAR,
    MaritalSatus VARCHAR(50),
    ContactNumber varchar(30),
    EmergencyNumber varchar(30),
    BloodGroup char(5),
    Photo VARCHAR(200),
    UpdatedOn datetime,
    CreatedOn datetime,
    token varchar(200),
    DesignationId int
);

/*ALTER TABLE User
MODIFY COLUMN DesignationId int;

ALTER TABLE user
ADD token varchar(50);
ALTER TABLE user
ADD DesignationId int;

alter table user change Password Password varchar(255);
ALTER TABLE user MODIFY Photo VARCHAR(200);
ALTER TABLE user MODIFY MaritalSatus VARCHAR(20);*/

/*ALTER TABLE User
Change Designation DesignationId int;*/

/* Designation Table  */
CREATE TABLE Designation (
    DesignationId INT(10) AUTO_INCREMENT PRIMARY KEY,
    Designation VARCHAR(100) NOT NULL Unique,
    CreatedOn datetime
);

insert into Designation(Designation, CreatedOn) values ('Software Engineer', now());
insert into Designation(Designation, CreatedOn) values ('Senior Software Engineer', now());
insert into Designation(Designation, CreatedOn) values ('Lead Software Engineer', now());
insert into Designation(Designation, CreatedOn) values ('HR Executive', now());
insert into Designation(Designation, CreatedOn) values ('CEO', now());
insert into Designation(Designation, CreatedOn) values ('Director', now());
insert into Designation(Designation, CreatedOn) values ('Vice President', now());
insert into Designation(Designation, CreatedOn) values ('Designer', now());
insert into Designation(Designation, CreatedOn) values ('Creative Director', now());
insert into Designation(Designation, CreatedOn) values ('Admin', now());
insert into Designation(Designation, CreatedOn) values ('Accountant', now());
insert into Designation(Designation, CreatedOn) values ('CRO', now());

/* Holiday Table  */
CREATE TABLE Holidays (
    HolidayId INT(10) AUTO_INCREMENT PRIMARY KEY,
    HolidayName VARCHAR(100) NOT NULL Unique,
    HolidayDate datetime NOT NULL,
    UpdatedOn datetime,
    CreatedOn datetime
);

/*
ALTER TABLE Holidays
ADD COLUMN HolidayDate datetime NOT NULL;
*/

insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('New Year', '2019-01-01', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Republic Day', '2019-01-26', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Holi', '2019-03-21', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Independence Day', '2019-08-15', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Gandhi Jayanti', '2019-10-02', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Dusshera', '2019-10-02', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Diwali', '2019-10-27', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Diwali Day 2', '2019-10-28', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Diwali Day 3', '2019-10-29', now(), now());
insert into Holidays(HolidayName, HolidayDate, UpdatedOn, CreatedOn) values ('Christmas', '2019-12-25', now(), now());

/* Role Table */
CREATE TABLE `role` (
    `Id` int(10) NOT NULL AUTO_INCREMENT,
    `RoleId` int(10) NOT NULL,
    `RoleName` varchar(100) NOT NULL,
    `UpdatedOn` datetime DEFAULT NULL,
    `CreatedOn` datetime DEFAULT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `RoleId` (`RoleId`),
    UNIQUE KEY `RoleName` (`RoleName`)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
 
 insert into role(RoleId, RoleName, UpdatedOn, CreatedOn) values(1 , 'Admin', now(),now());
 insert into role(RoleId, RoleName, UpdatedOn, CreatedOn) values(2, 'Employee', now(),now())

/* this table is the mapping table between user and role table */
CREATE TABLE User_Roles (
    Id INT(10) AUTO_INCREMENT PRIMARY KEY,
    UserId INT(10),
    RoleId INT(10),
    UpdatedOn datetime,
    CreatedOn datetime
);

/* LEave Type define the basic leave type  */
CREATE TABLE LeavesType (
    LeaveTypeId INT(10) AUTO_INCREMENT PRIMARY KEY,
    LeaveTypeName varchar(100),
    LeaveValue DECIMAL(5,2),
    UpdatedOn datetime,
    CreatedOn datetime
);

insert into LeavesType(LeaveTypeName,LeaveValue,UpdatedOn,CreatedOn)values('Holiday',0,NOW(),NOW());
insert into LeavesType(LeaveTypeName,LeaveValue,UpdatedOn,CreatedOn)values('Leave',1,NOW(),NOW());
insert into LeavesType(LeaveTypeName,LeaveValue,UpdatedOn,CreatedOn)values('Work from Home',0,NOW(),NOW());
insert into LeavesType(LeaveTypeName,LeaveValue,UpdatedOn,CreatedOn)values('Comp Off',0,NOW(),NOW());
insert into LeavesType(LeaveTypeName,LeaveValue,UpdatedOn,CreatedOn)values('Half Day',0.5,NOW(),NOW());
insert into LeavesType(LeaveTypeName,LeaveValue,UpdatedOn,CreatedOn)values('Special Leave',0,NOW(),NOW());

/* this table contains the basic leave info */
CREATE TABLE Leaves (
    LeaveId INT(10) AUTO_INCREMENT PRIMARY KEY,
    LeaveTypeId INT(10),
    UserId INT(10),
    Reason varchar(255),
    CreatedBy INT(10),
    UpdatedBy INT(10),
    LeaveDate datetime NOT NULL,
    UpdatedOn datetime,
    CreatedOn datetime
);


/* contains the Employee's leave based info 
Drop table Employee;*/
CREATE TABLE Employee (
    Id INT(10) AUTO_INCREMENT PRIMARY KEY,
    EmployeeId  varchar(50) ,
    StatusId INT(10),
    JoinedDate datetime,
    AvailableLeaves DECIMAL(5,2),
    UpdatedOn datetime,
    CreatedOn datetime
);


/* Leave Transaction Table for showing the log */
CREATE TABLE LeaveTransaction (
    Id INT(10) AUTO_INCREMENT PRIMARY KEY,
    UserId  INT(10) ,
    TransactionType varchar(100),
    TransactionValue varchar(100),
    PreviousLeave DECIMAL(10,2),
    AvailableLeave DECIMAL(10,2),
    UpdatedOn datetime,
    CreatedOn datetime
);

CREATE TABLE EmployeeStatus(
    StatusId INT(10) AUTO_INCREMENT PRIMARY KEY,
    StatusName varchar(100)
);

insert into EmployeeStatus(StatusName) values('Active');
insert into EmployeeStatus(StatusName) values('Inactive');

CREATE TABLE ActivityTable(
    ActivityId INT(10) AUTO_INCREMENT PRIMARY KEY,
    ActivityType varchar(255),
    ActivityBy INT(10),
    ActivityFor INT(10),
    ActivityDate datetime
);

Insert into user(
    EmpId ,
    Firstname ,
    Lastname ,
    Email ,
    Password ,
    AddressId ,
    DOB ,
    Gender ,
    MaritalSatus ,
    ContactNumber ,
    EmergencyNumber ,
    BloodGroup ,
    Photo ,
    UpdatedOn ,
    CreatedOn,
    DesignationId
    ) values(
    1,
    'Kumar',
    'Gaurav',
    'gkumar@techferry.com',
    'a3248dcb15ed85b0d960423256f8bc3476d2b72b24bbb797135144a43b2a6a488165d6aacfd932a6853b4b15a40df8edb73a554984a9d80890407d15ede8d07b',
    1,
    '1993-06-09',
    'M',
    'Single',
    '9013901390',
    '1234567890',
    'B+',
    '/public/images/',
    NOW(),
    NOW(),
    1
);

insert into Employee(
	EmployeeId,
    StatusId,
    JoinedDate,
    AvailableLeaves,
    UpdatedOn,
    CreatedOn
) values (
	'TF-01',
    1,
    '1993-06-04',
    5,
    NOW(),
    NOW()
);

Insert into Address(
    Street1,
    Street2,
    City,
    State,
    Zip,
    UpdatedOn,
    CreatedOn
) values(
	'A-111, vinod nagar',
    'north block',
    'Delhi',
    'Delhi',
    110091,
    NOW(),
    NOW()
);

Insert Into Leaves(
    LeaveTypeId,
    UserId ,
    Reason,
    CreatedBy,
    UpdatedBy,
    UpdatedOn,
    CreatedOn,
    LeaveDate
) values (
	5,
    1,
    "Headache",
    1,
    1,
    now(),
    now(),
    '2019-04-12'
);