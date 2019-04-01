$(document).ready(function () {

    var myKeyVals = "";

    $.ajax({
        type: 'POST',
        url: "/dashboard",
        data: myKeyVals,
        success: function (resultData) { 
            //console.log(resultData); 
            $('.employeeName').html(resultData.Firstname + " " + resultData.Lastname);
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
            $('.empPhoto').attr("src",".." + resultData.Photo +  resultData.EmpId + ".png");
        },
        error: function(err) {
            alert(err);
        }
    });
});
