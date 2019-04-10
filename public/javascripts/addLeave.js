var leavesType = [];
var leavesStringForDropDown = '';



$(document).ready(function () {

    $('#datepickerstart').change(function () {

        var startDate = $("#datepickerstart").val();
        var endDate = $("#datepickerend").val();

        $("#datepickerend").attr("min", startDate);

        if (startDate != null && startDate != "" && endDate != null && endDate != "") {
            showDateRows(startDate, endDate)
        }
        //alert(startDate);
    });

    $('#datepickerend').change(function () {

        var startDate = $("#datepickerstart").val();
        var endDate = $("#datepickerend").val();

        $("#datepickerstart").attr("max", endDate);

        if (startDate != null && startDate != "" && endDate != null && endDate != "") {
            showDateRows(startDate, endDate)
        }
        //alert(endDate);
    });

    $.ajax({
        type: 'GET',
        url: "/dashboard/fetchLeaveTypes",
        async: true,
        success: function (res) {

            leavesType = res;

            for (var i = 0; i < res.length; i++) {
                leavesStringForDropDown += `<option value="${res[i].LeaveTypeId}">${res[i].LeaveTypeName}</option>`;
            }

        },
        error: function (err) {
            console.log(err);
        }
    });



});

function showDateRows(startDate, endDate) {


    // console.log(leavesType);
    // console.log(leavesStringForDropDown);

    var start = moment(startDate, "YYYY-MM-DD");
    var end = moment(endDate, "YYYY-MM-DD");

    //Difference in number of days
    var diff = moment.duration(end.diff(start)).asDays();

    var dummyRow = '';
    $('.leaveDateSection').empty();

    for (var i = 0; i <= diff; i++) {
        let leaveDate = moment(start, 'MM/DD/YYYY').add(i, 'days').format('YYYY-MM-DD');
// Find Day of teh Week
var date = moment(leaveDate);
var dow = date.day();
console.log('dow',dow);
if(dow != 0 && dow != 6)
{        dummyRow += `<div class="row leaveData${i}" style="padding-bottom:10px;">
        <div class="col-md-5">
            <input type="date" class="form-control" id="leaveDate${i}"
    name="leaveDate" value="${leaveDate}" readonly><span class="pmd-textfield-focused"></span>
        </div>
        <div class="col-md-5">
            <select name="leave-type" id="leave-type${i}" class="form-control"
                title="Please select a Leave Type" required="">
                ${leavesStringForDropDown}
            </select><span class="pmd-textfield-focused"></span>
        </div>
        <div class="col-md-2">
            <div class="form-control btn btn-danger deleteLeaveRow" id="deleteLeaveRow${i}" data-id="${i}"
                name="deleteLeaveRow">Delete</div>
        </div>
    </div>`;
    }
    }
    $('.leaveDateSection').append(dummyRow);

    $('.multipleDateSection').show();
    //alert(diff);

    bindDeleteRow(startDate, endDate);

}

function bindDeleteRow(startDate, endDate) {

    $('.deleteLeaveRow').click(function (e) {

        //e.preventDefault();
        var dataId = $(this).data("id");
        $(`.leaveData${dataId}`).remove();

        if (isEmpty($('.leaveDateSection'))) {
            // do something
            $('.multipleDateSection').hide();
            $("#datepickerstart").val("");
            $("#datepickerend").val("");
            $("#datepickerend").removeAttr("min");
            $("#datepickerstart").removeAttr("max");
        }

    });

}

function isEmpty(el) {
    return !$.trim(el.html())
}