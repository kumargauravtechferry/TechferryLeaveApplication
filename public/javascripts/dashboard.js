$(document).ready(function () {

    //var myKeyVals = "";

    $.ajax({
        type: 'POST',
        url: "/dashboard",
        async: true,
        success: function (resultData) {
            console.log(resultData); 
            $('.employeeName').html(resultData.FirstName + " " + resultData.LastName);
            $('.employeeId').html(resultData.EmpId);
            $('.employeeEmail').html(resultData.Email);
            $('.empAddress').html(resultData.Street1 + " " + resultData.Street1 + " " + resultData.Street1 + " " + resultData.Street1);
            $('.empDob').html(resultData.DOB);
            $('.empGender').html(resultData.Gender);
            $('.empMStatus').html(resultData.MaritalSatus);
            $('.empContactNumber').html(resultData.ContactNumber);
            $('.empEmergencyContactNumber').html(resultData.EmergencyNumber);
            $('.empBloodGroup').html(resultData.BloodGroup);
            $('.empJoiningDate').html(resultData.JoinedDate);
            $('.empStatus').html(resultData.StatusName);
            $('.empAvailableLeaves').html(resultData.AvailableLeaves);
            $('.empDesignation').html(" (" + resultData.Designation + ")");
            $('.empPhoto').attr("src", ".." + resultData.Photo + resultData.EmpId + ".png");
        },
        error: function (err) {
            alert(err);
        }
    });

    $.ajax({
        type: 'POST',
        url: "/dashboard/fetchHolidays",
        async: true,
        success: function (res) {

            console.log(res);

            var event = [];
            for (var i = 0; i < res.length; i++) {
                event.push({
                    title: res[i].name,
                    start: res[i].leaveDate,
                    color: res[i].type == 'holiday' ? '#000' : '#999',
                    textColor: '#fff'
                })
            }

            var curDate = moment().format('YYYY-MM-DD')
            $('#calendar').fullCalendar({
                defaultDate: curDate,
                editable: false,
                navLinks: false,
                eventLimit: true, // allow "more" link when too many events
                events: event
            });

        },
        error: function (err) {

        }
    });

    $.ajax({
        type: 'POST',
        url: "/dashboard/fetchLeaves",
        async: true,
        success: function (res) {

            //console.log(res);

            var leavesTaken = 0;

            var dummyTableRow = '';
            $('.empLeavesTableBody').empty();

            for (var i = 0; i < res.length; i++) {
                leavesTaken += res[i].LeaveValue;
                dummyTableRow += `<tr>
                                <td>${moment(res[i].LeaveDate).format('DD-MM-YYYY')}</td>
                                <td>${res[i].LeaveTypeName}</td>
                                <td>${res[i].LeaveValue}</td>
                                <td>${res[i].Reason}</td>
                            </tr>`;
            }


            $('.empLeavesTaken').html(leavesTaken);
            $('.empLeavesTableBody').append(dummyTableRow);


        },
        error: function (err) {

        }
    });

});
