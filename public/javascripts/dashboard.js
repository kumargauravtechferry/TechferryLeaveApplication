$(document).ready(function () {

    //var myKeyVals = "";
    var id = document.getElementById("userId").value;
    console.log(id);

    var url = window.location.href;
    //console.log(url);
    var urlCheckPart = url.split("/");
    //console.log(urlCheckPart[urlCheckPart.length - 1]);

    var leaveID = id;

    setTimeout(function () {
        bindClickEvents();
    }, 100);


    if (urlCheckPart[urlCheckPart.length - 1] != "dashboard") {
        leaveID = urlCheckPart[urlCheckPart.length - 1];
    }

    $.ajax({
        type: 'Post',
        url: "/dashboard",
        async: true,
        data: {
            id: id
        },
        success: function (resultData) {
            //console.log(resultData); 
            //console.log(resultData.Photo);

            var image = new Image();
            image = resultData.Photo;
            $('.empPhoto').attr("src", "data:image/png;base64," + (resultData.Photo).toString());
            $('.profile-image-round').attr("src", "data:image/png;base64," + (resultData.Photo).toString());

            $('.employeeName').html(resultData.Firstname + " " + resultData.Lastname);
            $('.employeeId').html(resultData.EmployeeId);
            $('.employeeEmail').html(resultData.Email);
            $('.empAddress').html(resultData.Street1 + ", " + resultData.Street2 + ", " + resultData.City + ", " + resultData.State + "-" + resultData.Zip);
            $('.empDob').html(moment(resultData.DOB).format('YYYY - MMM - Do'));
            $('.empGender').html(resultData.Gender);
            $('.empMStatus').html(resultData.MaritalSatus);
            $('.empContactNumber').html(resultData.ContactNumber);
            $('.empEmergencyContactNumber').html(resultData.EmergencyNumber);
            $('.empBloodGroup').html(resultData.BloodGroup);
            $('.empJoiningDate').html(moment(resultData.JoinedDate).format('YYYY - MMM - Do'));
            $('.empStatus').html(resultData.StatusName);
            $('.empAvailableLeaves').html(resultData.AvailableLeaves);
            $('.empDesignation').html(" (" + resultData.Designation + ")");
            //$('.empPhoto').attr("src", resultData.Photo + resultData.EmployeeId + ".png");
        },
        error: function (err) {
            alert(err);
        }
    });

    $.ajax({
        type: 'POST',
        url: "/dashboard/fetchHolidays",
        async: true,
        data: {
            id: id
        },
        success: function (res) {

            console.log(res);
            var event = [];
            for (var i = 0; i < res.length; i++) {
                event.push({
                    title: res[i].name,
                    start: moment(res[i].leaveDate).format('YYYY-MM-DD HH:mm:ss'),
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
        data: {
            id: id
        },
        success: function (res) {

            //console.log(res);

            var leavesTaken = 0;

            var colctr = $('.leavesTable').columnCount();

            var dummyTableRow = '';
            $('.empLeavesTableBody').empty();

            for (var i = 0; i < res.length; i++) {
                leavesTaken += res[i].LeaveValue;

                if (colctr == 5) {
                    dummyTableRow += `<tr>
                    <td data-leaveid="${res[i].LeaveId}">${moment(res[i].LeaveDate).format('DD-MM-YYYY')}</td>
                    <td>${res[i].LeaveTypeName}</td>
                    <td>${res[i].LeaveValue}</td>
                    <td>${res[i].Reason}</td>
                    <td><button type="button" class="btn btn-warning btn-sm editLeave">Edit</button><button type="button" class="btn btn-danger btn-sm deleteLeave" style="margin-left: 15px;" data-toggle="modal" data-target="#deleteLeaveModal" data-id="${i}">Delete</button></td>
                </tr>`;
                } else {
                    dummyTableRow += `<tr>
                    <td data-leaveid="${res[i].LeaveId}">${moment(res[i].LeaveDate).format('DD-MM-YYYY')}</td>
                    <td>${res[i].LeaveTypeName}</td>
                    <td>${res[i].LeaveValue}</td>
                    <td>${res[i].Reason}</td>
                </tr>`;
                }

            }


            $('.empLeavesTaken').html(leavesTaken);
            $('.empLeavesTableBody').append(dummyTableRow);

            // var rowctr = $('.leavesTable').rowCount();
            // var colctr = $('.leavesTable').columnCount();

            // console.log('No of Rows:' + rowctr);
            // console.log('No of Columns:' + colctr);


        },
        error: function (err) {

        }
    });

});

$.fn.rowCount = function () {
    return $('tr', $(this).find('tbody')).length;
};

$.fn.columnCount = function () {
    return $('th', $(this).find('thead')).length;
};




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

function bindClickEvents() {

    var indexId = 0;

    $('.deleteLeave').click(function () {
        var index = $(this).data('id');
        indexId = index;
        index = parseInt(index) + 1;
        console.log(index);

        //var row = $(".empLeavesTableBody").find('tr').eq(index);
        var leaveDate = $('.leavesTable tr:nth-child(' + index + ') td:nth-child(1)').html();
        //console.log(cell);
        
        $("#leaveDate").html(leaveDate);


    });

    // $('#deleteLeaveModal').on('show.bs.modal', function(e) {

    //     //get data-id attribute of the clicked element
    //     var bookId = $(e.relatedTarget).data('id');

    //     console.log(bookId);

    //     //populate the textbox
    //     $('#bookId').html(bookId);
    // });

    $('.deleteLeaveYesButton').click(function () {
        var index = indexId;
        index = parseInt(index) + 1;
        console.log(index);

        //var row = $(".empLeavesTableBody").find('tr').eq(index);
        var leaveDate = $('.leavesTable tr:nth-child(' + index + ') td:nth-child(1)').html();
        var leaveReason = $('.leavesTable tr:nth-child(' + index + ') td:nth-child(4)').html();
        var leaveValue = $('.leavesTable tr:nth-child(' + index + ') td:nth-child(3)').html();
        var leaveTableId = $('.leavesTable tr:nth-child(' + index + ') td:nth-child(1)').data('leaveid');
        //console.log(cell);
        
        $("#leaveDate").html(leaveDate);

        var id = document.getElementById("userId").value;
        //console.log(id);

        var url = window.location.href;
        //console.log(url);
        var urlCheckPart = url.split("/");

        var leaveID = id;

        if (urlCheckPart[urlCheckPart.length - 1] != "dashboard") {
            leaveID = urlCheckPart[urlCheckPart.length - 1];
        }

        $.ajax({
            type: 'POST',
            url: "/dashboard/deleteLeave",
            async: true,
            data: {
                id: leaveID,
                leaveDate: leaveDate,
                leaveReason: leaveReason,
                leaveTableId: leaveTableId,
                leaveValue: leaveValue
            },
            success: function (res) {

                //console.log(res);

                if(res){
                    window.location.reload();
                }
                

            },
            error: function (err) {

            }
        });

    });
}