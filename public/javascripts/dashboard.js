$(document).ready(function () {

    //var myKeyVals = "";

    $.ajax({
        type: 'POST',
        url: "/dashboard",
        async: true,
        success: function (resultData) {
            console.log(resultData);
            $('.employeeName').html(resultData.Firstname + " " + resultData.Lastname);
            $('.employeeId').html(resultData.EmployeeId);
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
            $('.empPhoto').attr("src", resultData.Photo + resultData.EmployeeId + ".png");
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



function getHolidays() {
    $.ajax({
        type: 'POST',
        url: "/dashboard/holidaysLeave",
        async: true,
        success: function (res) {

            console.log(res);
            createHolidayLeaveTable(res);
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

}

function createHolidayLeaveTable(arr) {
    var html = ``;

    html = `<table id="holidayLeave" class="table table-striped" cellspacing="0" width="100%"><thead><tr><th class="th-sm">Leave
                    </th>
                    <th class="th-sm">Leave Date
                    </th>

                </tr>
            </thead>
            <tbody>`
    for (var i = 0; i < arr.length; i++) {
        html += '<tr>';
        html += '<td>' + arr[i].name + '</td>';
        html += '<td>' + moment(arr[i].leaveDate).format('MMM - Do - YYYY') + '</td>';
        html += '</tr>';
    }
    html += ` </tbody>
        </table>`;

    if ($('#holidayDayTable').length) {
        $('#holidayDayTable')[0].innerHTML = html;
    }
}