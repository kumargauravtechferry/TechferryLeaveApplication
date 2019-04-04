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
    Photo LONGTEXT,
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
CREATE TABLE Role (
    Id int(10) NOT NULL AUTO_INCREMENT,
    RoleId int(10) NOT NULL,
    RoleName varchar(100) NOT NULL,
    UpdatedOn datetime DEFAULT NULL,
    CreatedOn datetime DEFAULT NULL,
    PRIMARY KEY (Id),
    UNIQUE KEY RoleId (RoleId),
    UNIQUE KEY RoleName (RoleName)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
 


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
    'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAmVBMVEX///+9w8csPlA0SV7s8PGVpaYyR1uRoaKruLnCyMsqQVguRVu/xckwRFfx9PUkPVW4vsMkOEuPmaFodYMcMka/yMgnOk0AJT2wt7z2+vrl6usRLELQ1dg5TWF/iZHb3+IVNE7W2tx1f4miqrFSYnMPMUxHWWuZoqoAITpjcX+DjJQVLkSgra87S1tmc4FwfIpOX3BcaHRGVGObqCSuAAANVklEQVR4nN2d6XqqOhSGBalbhgoOW3FGsVptd1vP/V/cSZhMIAlDQoL9fpznPLuAeV3rWxlA0utJ0coMb9+nbT/W9vR9C82VnI+WoJX/bQWuZduDfqqBbVtuYH37v4DSCM+Ark8WoDyHhuomcmkzDVybghfLdoPpRnUzG0s7B2y8BDI4a6qb2khmNb6E0VTd3Npa3SvzxYz3Jys6l7c6fBHj20V1o2todXZr8kG556cJo187gGkYQ9VNr6bvoBEfVDBV3fgKMs60/r2KrHPnBwCHkh6+TLZ7UI3A1qZ5hqYKOj3Ecd64Afv9N0c1Bl2aCECA2NlBnCkGECB2dAyX96BlWdWqjl04spteXOGA7vk4mXxvS0vrwLLut8ntjh8YdHB4s+yjTbT7F9N0HNMMp9T5b3Sce5544EjT9O/oSM/uL1UDFXRCAd2r42iRHNPb9WmMtnsNzeRIx5ygh9kn1UB5TdAIuEczAYya7ky2JEda7rePHKeZIYroTlQj4cLKqLszNUymeTm5GKRtu9udh/LBw3wUsVsFdYRG0PrOAcbJOrluLRdUTfgf+7QLzRxfFEUsE0aqsRBdkfjYP0VAyAiqieaHl8slDEFtKeJFiGiy21fVWA/5aEdhe8TGx5SJaAdo5hVJ1MBXDZYKy1H3QgxhRTnOFr1WV/L0G/nebYIJayGiVrS+VaPFwkdrGj0FK8n8RjzdkdHbGWmSe+EEBF8Q6umzajgoHy1/d74cjRAvyAXdLhQbbCDi84YQyESTwlKN1+uh37g95Q9hrti4yteJR2iZsehdYR2Zd7TYqO4xLkiSWkcRIQRBRK1tKQ7iEuvsxYQQBBGdirlqZ4qhcBdC4U5Uu9SPTXtFFNJY5nmAfHMqAR00Sc+iQggIb2iaqlw/RYueqDoDhdUalbMobHnNDYUlKQgiOsVQuPCG9vb9rbgQAsIdmh3qOgyEr2/dRBJiadrvqwLctDCeSYV1icomUROBM9+8HGywpGplEVtwENcZxsJqzVYN4B5JUtEhBEFEMyTYKyFE88jmXbwoCh3XKKqmSC3gX7woCh2cqrmLsXws5NtX0TkKZR4fSfKmYoJhZl+xvWWs8fIgPpYzXBU3MR6VwBJdRxM5XkaopL/IbCh0QIojZlZUYcRl2lfwLeOzZWYj30C+EQ9B+4AIYiD/UalkaNwu4ANRwdLwzRrYtu1O2gWMbimCzxlYN+mEP9uf0/3otw0I730f7yfwaVLpRqYHb+PS7uQKlhN/FPhIaYvDhieBiyRP1sOnivig5ADuVYUQBFHOLEqG92iSsnQ6UhdCEEQZxUZhkkpK04NCQE2TMXjbKCWUsa74+wnbH6exJGOu//tj+PsJD0oJZdTS398fKptZRIQyZhdLpYRSFqR+/chbaTGVs+K2Ujg/lPTMgkJCOYAKx22y7ucrS1NZSapwKUoWYG+vCFDi3Xw1aSqrzkApGZtKWkpMpABQoguhFJRTeYU0lvyhm/Rn22R3+/IfFF5KJlTwQM1IKqCS35Us5U0UHUW/uThII1T1zhppKzbS7v0WJI1QFaC0TlHdb2UljWxkj2ZQSSJUBygpTVX+oFtKmqpMUkmzKJWAvYMEQLWvqJPw6ImUB0wYkvBsolrA9kdu6kZsqVp/glY1YNsdhtquIla7s8QuvCWy1SB2IYTtOlG9C6FaLKfqC2msFn8zoxotUWtPZ8h58qKKWrpRI/dWDFst/TpPNRaiVopNV8pMrIN4RK9jL/YWX0+7UkdTCa+n3amjqQQP3roxXMMl1IpdM2EskUuL3XgjZEEC3xOlGoUmUR1/l7p6XKLufHeujD4kBrHDgGIQOw3Y4y83nS0yD214+kWvo90ELo6uv5sdfVGrxoQdHKqR9bfRu9sc76/qhlfW3z/D2m8dcpzhn2cifPmsGUbH+3x5LsKXP581XnDmaJ/wlOciBBpWZHS0YXT88xG+vIA4lkGCAz6To5+REDD6rO0swN/8z+zY5yR8gUVHI1HCfwN46KHPSRhHcug9NihJtinxhp+5o56ZMI7l5+dw6Pv+cAj+74V0yNMQLo0hof2l+jM0uj5xSjQyjFEDxD9DeKLqxlcRaGcTxAjwKRCjdtZHTACfADFpZ13EDLDziFk76yEigB1HRNpZBxED7DQi1s7qiDnADiMuDaMJYgHQ6Gi/uDkd8g2thEgANA4/3Vtz29wDNyw2tRyRBDgK3eDUrYXTzSmw+/ZXsa2liCRAY/QFrhacu3ODxvwJ4rcmr4qNLUEkAhqr+O3I7lblLy0e0s4JX9/1SM1lIZIBR17y8uCBa6vfd81D9jS2JqQgMhDJgMYK2TTAVbyjlT9w0W2LvorVlIVIATQOX9gmS8FFWefh29hWKf3+1iG2mIJIAzSwnTphbgQTJWOA0M3xwVdS76sjUgH3fuHC1pt0xuWlyAeNaFJaXUSkAo7w7auzON5kPuY2mqxng2Ir+vbUIdYaAiIV0Fg5U9J+7IPZYieLEfLpOomw3zc3lHbnEOmAxsYkXnmg67PFUcbtN+O2AHwUQtfXaA3HEBmAhla0YUKo6+P2GVe7mI9CaE0cSq3BEFmAe4dkw4QQMk7bfHJ4dVyMdZ1BaE9NWq1BEFmAI9Mk2jAlbJVxP33P+Gg+3JoerdZkiCxAY+WZW+KVB4+PHr/f27jfv58uED4aITAitdYkiExAY0OxIUoI43gXPYHcf71jfDRCYER6rYkRmYCGRrEhTggZTyIZ91+LHB+NEO5FSq81EPEvE3CvUWyYJ9T1+eJH1CS5GD86IegRNUatARow+cHZlOsWCAHj+p+ICeT+Wowfg9D1HVatWR7Xx8KC1UMrz6HYkEQIGV95J5D7Kyl+DEJoRHqtGTkLfeHQY7yh2pBMCPQx5tlNlxY/BmG0KTA9SNGp9D9rVBtSCfX57OPScOLB4qP7EG5HSqs1yyMcEM2oebrPbXtYiRBecd1kckWqn1UI4VaPlFoz0hbRqQuN8nczv/9oRUI4KK/LiI7P6hFCI9JqTXYy+c8rj27DEkLA+FFnQWd1pNWXcsLIiMRaE+do1Bpynm4YNiwlhLlalXF0K4sfixD2iMRaA+toKnI9BefResMqhIBxVqWujm7p/KghYbTnKqnWzJGz54S/7wvbANclrMK4jObvXITQiIRa88jRqCXFPAV1hmHDioSgf5wzxzmXqnwMwsiIhVqT1tFUxXoKfxpGt2FlQl1f/0edP4azynwsH0YbdBdqTeEC+QPgz6aovWEdQjAmJ29DZ+of1S/CIow3P2blKFQhTzWmDesQgou/EsJ4W5SfWI0wMiJea/I5CpXLU/j2ZYYN6xHq8/fCiPxeK4BMwsiIuVozJ1wBq6ej6By6DWsSgi8wtzfrqYYDywhjI6K1ppijUFieRj9BZdiwNqG+3qGAxBY0JoyN+Kg1I21NbgOSp5sSG9Yn1NdIvfFrehDqtaCMOTYiUmtIOQqF5KmG23BQvHz9Ji6y3t9oAFjUI6ixEbNaszzSBoHjLE+jt7yjNqwfMoLe04r6VWEYWiYsaSMjprWGVEdTpfV0FJ+A2VAA4/y/GPDAH8KcKWMjprWGlqNRG5A6U7AhP+M6fl/flDeEhaKTGHHDzlGoJE83Grk35GWc/4tc+M53FUJRTYyoleQoVJynWt6GohgXm2g0ynMJ2u0LLa01rByFmqd1htYbcjHOYI/xX1kbGGIt1kS1hp2jUCBP4zrTdImGrVcw421eZ8qGpppnOOVXXzjx223EDUqxq496G/J4o1yMQU1mxE2VIjbe0G3Izbg2G9vwldGcfrxYA+IyLb/6bBr/Yoi+RBOpwZgmunrY2zXtK1gxTI0IAlOGOEvCzRyUNo/h+NY7NS40rAYlRixHTAGZNgRq2sjxsfev6bnMPE2NWIY4Q45j2bBhjgL912t8KjtPt9m7FViID0Dm3JCnv/jHQ8jK09SITEQEkG1DnkZyETLyNDMiAxEBZNuweY7qnISlizVMxBl+iLglGlx8hKw8RV9yYhLmL+MpdgTjSnxN5CSk5yliRPibXwIh+ttglg25chQQcp7Pvn2RRYgwrhjvkBgKuGFBE0d/GIvWMNSIjkNcL3XQYkS1IWf7uGNIz9NHjwhCSKw0SBDpvSFv+3h9qJfOEWEINfLIcJ69VaKduWEsfkJanj6MSA4hGkS6DfmbJ4CQkqeZEUmFNFZWTqk25M5RIYSMR9yohTRWVk5rPMxWWyIIKXmaGJHmQqjEiVQbimgcd28BRc7TxIg0F0IlTqTZUECO6q+9L46ltky0h76ZLoSKnVj2aDeHwAx4wrVcmooYgqhHpLswakAUREpvKKJhs7BnNl1rw0TMU2hElguhoBMpNhSRo/pi1euNRaQpMU+hEdkhjJ1ItqGQ+2vR3acmt0cJIrQRGJHtQijgRLINhbTqPXrc/dhanm7NshBGTiTaUEiOfiT38nflTyJWECFPgRHLLTAn2lBIjq7v6W3uw+5jPZuNMzVzZrGZ1uRW/t2NbyQbNmoBpvlsgT2NuffD2+54PO6AjtdGw4BintrXKrn2ei3aUECO3sP4qeH/AUz+em7b0rsrAAAAAElFTkSuQmCC',
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

 insert into role(RoleId, RoleName, UpdatedOn, CreatedOn) values(1 , 'Admin', now(),now());
 insert into role(RoleId, RoleName, UpdatedOn, CreatedOn) values(2, 'Employee', now(),now());
 
insert into User_Roles(UserId, RoleId, UpdatedOn, CreatedOn) values(1 ,1, now(),now());