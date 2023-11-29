window.onload = function(){
    const accessT = localStorage.getItem('token')
    if(!accessT){
        location.href = "/userlogin.html"
        return;
    }
    display();
}

function logout(){
    localStorage.removeItem('token')
    location.href = "/userlogin.html"
}

//Employee Details Display Function
function display(){
    var content ="<div class='table'><div class='user-header'><span class='headcell'>EMPLOYEE ID</span><span class='headcell'>NAME</span><span class='headcell'>EMAIL</span></div>";
    var htt = new XMLHttpRequest();
    htt.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status==200){
                res = this.responseText
                user_json=JSON.parse(res)
                var AUthUSER = localStorage.getItem("EMPLOYEEID");
                for(let u in user_json){
                    if (user_json[u].email == "admin@gmail.com"){
                        continue;
                    }else{
                      var usr = `<div class='user'><span class='cell'>${user_json[u].EmployeeID}</span><span class='cell'>${user_json[u].fullName}</span>&nbsp;&nbsp;
                    <span class='cell'>${user_json[u].email}</span>&nbsp;&nbsp;
                    <button class="btn" onclick="redirectToNextPage('${user_json[u].EmployeeID}')">Manage Task</button>
                    <button class="btn" onclick="deleteEmployee('${user_json[u]._id}')">Delete Employee</button><p/><br></div>`;
                    content=content+usr
                    }
                }
                var element = document.getElementById('root')
                element.innerHTML = content+"</div>";
            }
        }
    }
    htt.open("GET","http://localhost:5000/employee",true)
    htt.send();
}

//Employee Display Function after search
function searchEmp() {
  const searchTerm = document.getElementById("empSearch").value;
  var content =
    "<div class='table'><div class='user-header'><span class='headcell'>EMPLOYEE ID</span><span class='headcell'>NAME</span><span class='headcell'>EMAIL</span></div>";
  var htt = new XMLHttpRequest();
  htt.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        res = this.responseText;
        user_json = JSON.parse(res);
        var AUthUSER = localStorage.getItem("EMPLOYEEID");
        for (let u in user_json) {
          if (user_json[u].email == "admin@gmail.com") {
            continue;
          } else {
            var usr = `<div class='user'><span class='cell'>${user_json[u].EmployeeID}</span><span class='cell'>${user_json[u].fullName}</span>&nbsp;&nbsp;
                    <span class='cell'>${user_json[u].email}</span>&nbsp;&nbsp;
                    <button class="btn" onclick="redirectToNextPage('${user_json[u].EmployeeID}')">Manage Task</button>
                    <button class="btn" onclick="deleteEmployee('${user_json[u]._id}')">Delete Employee</button><p/><br></div>`;
            content = content + usr;
          }
        }
        var element = document.getElementById("root");
        element.innerHTML = content + "</div>";
      }
    }
  };
  htt.open(
    "GET",
    `http://localhost:5000/employee/search?searchTerm=${searchTerm}`,
    true
  );
  htt.send();
}

function deleteEmployee(dltflt) {
	var xxhttp = new XMLHttpRequest();
	xxhttp.open("DELETE","http://localhost:5000/employee/"+dltflt,true)
    xxhttp.send();
        xxhttp.onreadystatechange =function () {
            if(this.readyState == 4){
                if(this.status == 200){
                    display();
                }
            }
        };  
}

function redirectToNextPage(EmpID) {          
            const valueToPass = EmpID;
            // Redirect to the next page with the value as a query parameter
            window.location.href = `/managetask.html?valueToPass=${encodeURIComponent(valueToPass)}`;
        }