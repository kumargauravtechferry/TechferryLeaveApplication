$(document).ready(function () {

    var empId = "";

    $.ajax({
        type: 'POST',
        url: "/dashboard/view-employees",
        async: true,
        success: function (res) {
            console.log(res);
            // $('.employeeName').html(resultData.FirstName + " " + resultData.LastName);
            // $('.employeeId').html(resultData.EmpId);
            var card = "";
            $('.empList').empty();

            for (var i = 0; i < res.length; i++) {
                card += `<div class="col-xs-12 col-sm-6 col-md-4">
                    <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                        <div class="mainflip">
                            <div class="frontside">
                                <div class="card">
                                    <div class="card-body text-center">
                                        <p><img class=" img-fluid"
                                                src="${res[i].Photo}${res[i].EmployeeId}.png"
                                                alt="card image"></p>
                                        <h4 class="card-title empListName">${res[i].FirstName} ${res[i].LastName}</h4>
                                        <h6 class="card-title empListDesignation">${res[i].Designation}</h6>
                                        <p class="card-text">
                                            Employee ID: <span class="empListEmpId">${res[i].EmpId}</span><br>
                                            Email ID: <span class="empListEmail">${res[i].Email}</span><br>
                                            Contact Number: <span class="empListConatctNumber">${res[i].ContactNumber}</span><br>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="backside">
                                <div class="card">
                                    <div class="card-body text-center mt-4">
                                        <h4 class="card-title empListName">${res[i].FirstName} ${res[i].LastName}</h4>
                                        <h6 class="card-title">Leaves Taken</h6>
                                        <h5 class="card-title empListLeavesTaken">${res[i].TotalLeaves}</h5>
                                        <h6 class="card-title">Available Leaves</h6>
                                        <h5 class="card-title empListAvailableLeaves">${res[i].AvailableLeaves}</h5>
                                        <ul class="list-inline">
                                            <li class="list-inline-item">
                                                <button class="btn btn-primary btn-sm btn-block viewEmpDetails" name="${res[i].UserId}" style="color:#fff !important">
                                                    View/Edit Employee Details
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                $('.empList').append(card);
            }


        },
        error: function (err) {
            alert(err);
        }
    });


    setTimeout(function(){
        bindClickEvents();
    }, 10);

    

});

function bindClickEvents(){
    $('.viewEmpDetails').click(function(){

        var params = {
            userId: $(this).attr("name")
        };

        $.ajax({
            type: 'POST',
            url: "/dashboard/viewEmployeeDetails",
            data: params,
            async: true,
            success: function (res) {
    
                //console.log(res);
    
                
    
            },
            error: function (err) {
    
            }
        });
    });
}

