// Retrieve the value from the URL
const urlParams = new URLSearchParams(window.location.search);
const passedValue = urlParams.get("valueToPass");

console.log(`Received value: ${passedValue}`);

//Checking for declined task notification 
setInterval(declineNotification, 1000);

function declineNotification() {
  fetchDeclineTasks();
}

function fetchDeclineTasks() {
  var userId = passedValue;
  console.log("MYID",userId);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var newTasks = JSON.parse(this.responseText);
        console.log(newTasks);
        if (newTasks.length > 0) {
          let notificationMessage = "This employee have declined task:\n";
          newTasks.forEach(function (task) {
            notificationMessage += `<br>Task ID: ${task.taskID}, Task Name: ${task.taskName}\n<br>Comments: ${task.comment}\n`;
            // deleteTask(task._id);
          });
          display();
          toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-left",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": 0,
  "extendedTimeOut": 0,
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut",
  "tapToDismiss": false
}
          toastr["error"](
            `${notificationMessage}`,
              "New Notification"
          );
          // alert(notificationMessage);  
                  
        }
      }
    }
  };
  xhr.open(
    "GET",
    `http://localhost:5000/task/declinenotifications/${userId}`,
    true
  );
  xhr.send();
}

window.onload = function () {
  const accessT = localStorage.getItem("token");
  if (!accessT) {
    location.href = "/userlogin.html";
    return;
  }
  display();
};

function logout() {
  localStorage.removeItem("token");
  location.href = "/userlogin.html";
}

//Show form to add task
function visibileUserForm() {
  document.getElementById("popupForm2").classList.remove("hidden2");
}

var task_json = "";
//View All Task function
function display() {
  var content =
    "<div class='table'><div class='user-header'><span class='headcell'>TASK ID</span><span class='headcell'>TASK NAME</span><span class='headcell'>STATUS</span><span class='headcell'>END DATE</span><span class='headcell'>ASSIGNED AT</span><span class='headcell'>UPDATED AT</span></div>";
  var htt = new XMLHttpRequest();
  htt.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        res = this.responseText;
        task_json = JSON.parse(res);
        let flag = 0;
        for (let u in task_json) {
          if (passedValue == task_json[u].EmployeeID) {
            flag = 1;
            var assAt = task_json[u].created_at.toString().slice(0, 16).replace('T', ' ');
            var upAt = task_json[u].updated_at.toString().slice(0, 16).replace('T', ' ');
            var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>&nbsp;&nbsp;
                    <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span><span class='cell'>${assAt}</span><span class='cell'>${upAt}</span>
                    <button class="btn" onclick="editTask('${task_json[u]._id}')">Update</button>&nbsp;<br>
                    <button class="btn" onclick="deleteTask('${task_json[u]._id}')">Delete</button></div>`;
            content = content + usr;
            var element = document.getElementById("root");
            element.innerHTML = content + "</div>";
          }
        }
        if (flag == 0) {
          var element = document.getElementById("root");
          element.innerHTML =
            content +
            "<div class='user'>No tasks assigned so far</div></div>";
        }
        
      }
    }
  };
  htt.open("GET", "http://localhost:5000/task", true);
  htt.send();
}

//Task Display Function after search
function searchTasks() {
  const searchTerm = document.getElementById("Searchtask").value;
  const tableBody = document.getElementById("root");
  tableBody.innerHTML = ""; // Clear existing content
  var content =
    "<div class='table'><div class='user-header'><span class='headcell'>TASK ID</span><span class='headcell'>TASK NAME</span><span class='headcell'>STATUS</span><span class='headcell'>END DATE</span><span class='headcell'>ASSIGNED AT</span><span class='headcell'>UPDATED AT</span></div>";
  var htt = new XMLHttpRequest();
  htt.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        res = this.responseText;
        task_json = JSON.parse(res);
        let flag = 0;
        for (let u in task_json) {
          if (passedValue == task_json[u].EmployeeID) {
            flag = 1;
            var assAt = task_json[u].created_at.toString().slice(0, 16).replace('T', ' ');
            var upAt = task_json[u].updated_at.toString().slice(0, 16).replace('T', ' ');
            var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>&nbsp;&nbsp;
                    <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span><span class='cell'>${assAt}</span><span class='cell'>${upAt}</span>
                    <button class="btn" onclick="editTask('${task_json[u]._id}')">Update</button>&nbsp;<br>
                    <button class="btn" onclick="deleteTask('${task_json[u]._id}')">Delete</button></div>`;
            content = content + usr;
            var element = document.getElementById("root");
            element.innerHTML = content + "</div>";
          }
        }
        if (flag == 0) {
          var element = document.getElementById("root");
          element.innerHTML =
            content + "<div class='user'>No tasks assigned so far</div></div>";
        }
      }
    }
  };
  htt.open(
    "GET",
    `http://localhost:5000/task/search?searchTerm=${searchTerm}`,
    true
  );
  htt.send();
}

function getComments(Id){
document.getElementById("popupForm1").classList.remove("hidden1");
var ind = task_json.findIndex((e) => e._id === Id);
console.log(ind);
document.getElementById("com").value = task_json[ind].comment;
}

function closePopup() {
  document.getElementById("popupForm1").classList.add("hidden1");
}
function closePopup2() {
  document.getElementById("popupForm2").classList.add("hidden2");
  event.preventDefault();
}
function closePopup3() {
  document.getElementById("popupForm3").classList.add("hidden3");
  event.preventDefault();
}

const user = localStorage.getItem("USER");
console.log(user);

//Add Task function
function addTask() {
  var comment="No Comments"
  // var taskid = document.getElementById("tasknum").value;
  var taskname = document.getElementById("taskname").value;
  var cstatus = document.getElementById("presence").value;
  var end = document.getElementById("end").value;
  var xhttp = new XMLHttpRequest();
  if (taskname == "" || end=="") {
    toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-left",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
toastr["error"]("Provide All the Details.", "ALERT!!!");
    // alert("Provide All the Details!!!");
    event.preventDefault();
    return;
  }
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        display();
      }
    }
  };
  xhttp.open("POST", "http://localhost:5000/task", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(
    JSON.stringify({
      EmployeeID: passedValue,
      taskName: taskname,
      status: cstatus,
      End_Date: end,
      New_Notification: true,
      Decline_Notification: false,
      comment:comment,
    })
  );
   toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
  toastr["info"]("Task Added Successfully!!!");
 
  document.getElementById("popupForm2").reset();
  // form.style.display = "none";
  document.getElementById("popupForm2").classList.add("hidden2");
  event.preventDefault();
}

function deleteTask(dlttsk) {
  var xxhttp = new XMLHttpRequest();
  xxhttp.open("DELETE", "http://localhost:5000/task/" + dlttsk, true);
  xxhttp.send();
  xxhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        console.log("Hai delete");
        display();
      }
    }
  };
  toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
  toastr["info"]("Task Deleted Successfully!!!");
}

let TASKID;
var upform;

//Edit Task Details function
function editTask(tkId) {
  document.getElementById("popupForm3").classList.remove("hidden3");
  TASKID = tkId;
  var ind = task_json.findIndex((e) => e._id === tkId);
  console.log(ind);
  document.getElementById("utasknum").value = task_json[ind].taskID;
  document.getElementById("utaskname").value = task_json[ind].taskName;
  document.getElementById("upresence").value = task_json[ind].status;
  document.getElementById("uend").value = task_json[ind].End_Date;
}

function updateTask() {
  var upnumber = document.getElementById("utasknum").value;
  var upname = document.getElementById("utaskname").value;
  var upstatus = document.getElementById("upresence").value;
  var upend = document.getElementById("uend").value;
  var comments = "No Comments";
  if (upnumber === "" || upname === "") {
    alert("Provide All the Details!!!");
    event.preventDefault();
    return;
  }
  xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        display();
      }
    }
  };
  xhttp.open("PUT", "http://localhost:5000/task/" + TASKID, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  if (upstatus == "Assigned") {
    xhttp.send(
      JSON.stringify({
        EmployeeID: passedValue,
        taskID: upnumber,
        taskName: upname,
        status: upstatus,
        End_Date: upend,
        New_Notification: true,
        Decline_Notification: false,
        comment: comments,
      })
    );
  } else {
    xhttp.send(
      JSON.stringify({
        EmployeeID: passedValue,
        taskID: upnumber,
        taskName: upname,
        status: upstatus,
        End_Date: upend,
      })
    );
  }
  event.preventDefault();
  toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
  toastr["info"]("Task Updated Successfully!!!");
  
  document.getElementById("popupForm3").reset();
  document.getElementById("popupForm3").classList.add("hidden3");
}

function checkTaskUnique() {
  var TSKid = document.getElementById("tasknum").value;
  var ttp = new XMLHttpRequest();
  ttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var res = JSON.parse(this.responseText);
        console.log(res);
        if (res.uniquetask) {
          document.getElementById("idErr").innerHTML =
            "Task ID already exist!<br>Please provide a different Task ID";
          document.getElementById("tasknum").value = "";
        } else {
          document.getElementById("idErr").innerHTML = "";
        }
      }
    }
  };
  ttp.open("GET", `http://localhost:5000/checktskid?taskID=${TSKid}`, true);
  ttp.send();
}

function validateDate() {
  var endDateInput = document.getElementById("end");
  var dateError = document.getElementById("dateError");

  var selectedDate = new Date(endDateInput.value);
  var today = new Date();
  dateError.innerHTML = "";

  if (selectedDate < today) {
    dateError.innerHTML = "End date must be greater than or equal to today.";
    endDateInput.value = ""; 
  }
}