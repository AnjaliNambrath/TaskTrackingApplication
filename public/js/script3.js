//Checking for new task notification
setInterval(displayNotification, 1000);
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

function displayNotification() {
  fetchNewTasks();
}

function fetchNewTasks() {
  var userId = localStorage.getItem("EMPLOYEEID");
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var newTasks = JSON.parse(this.responseText);
        console.log(newTasks);
        if (newTasks.length > 0) {
          let notificationMessage = "You have new tasks update:\n";
          console.log("You have new tasks");
          newTasks.forEach(function (task) {
            notificationMessage += `<br>Task ID: ${task.taskID}, Task Name: ${task.taskName}\n`;
          });
          display();
          toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: false,
            progressBar: false,
            positionClass: "toast-bottom-left",
            preventDuplicates: false,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: 0,
            extendedTimeOut: 0,
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
            tapToDismiss: false,
          };
          toastr["success"](`${notificationMessage}`, "New Notification");
        }
      }
    }
  };
  xhr.open("GET", `http://localhost:5000/task/notifications/${userId}`, true);
  xhr.send();
}

const username = localStorage.getItem("USER");

//Task Display Function
function display() {
  var content = `<div class="links">
                <button> HEY ${username} ! HERE IS YOUR ASSIGNED TASKS </button>
        </div>
        <div class='table'><div class='user-header'><span class='headcell' id='taskIDHeader'>TASK ID
          <div class="sort-buttons">
            <button onclick="sortData('taskID', 'asc')">▲</button>
            <button onclick="sortData('taskID', 'desc')">▼</button>
          </div>
        </span>
        <span class='headcell' id='taskNameHeader'>
          TASK NAME
          <div class="sort-buttons">
            <button onclick="sortData('taskName', 'asc')">▲</button>
            <button onclick="sortData('taskName', 'desc')">▼</button>
          </div>
        </span><span class='headcell' id='statusHeader'>
          STATUS
          <div class="sort-buttons">
            <button onclick="sortData('status', 'asc')">▲</button>
            <button onclick="sortData('status', 'desc')">▼</button>
          </div>
        </span><span class='headcell' id='endDateHeader'>
          END DATE
          <div class="sort-buttons">
            <button onclick="sortData('End_Date', 'asc')">▲</button>
            <button onclick="sortData('End_Date', 'desc')">▼</button>
          </div>
        </span></div>`;
  var htt = new XMLHttpRequest();
  htt.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        res = this.responseText;
        var EID = localStorage.getItem("EMPLOYEEID");
        task_json = JSON.parse(res);
        let flag = 0;
        for (let u in task_json) {
          console.log(typeof EID);
          if (EID == task_json[u].EmployeeID) {
            flag = 1;
            console.log("SSSS", task_json[u].status);
            if (task_json[u].status == "Completed") {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}</span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color: rgb(13, 97, 13);" class="Cbtn" disabled>Task Completed</button>
                                <p/><br></div>`;
              content = content + usr;
            } else if (task_json[u].status == "Declined") {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color:rgb(216, 24, 24);" class="Cbtn" disabled>Task Declined</button>
                                <p/><br></div>`;
              content = content + usr;
            } else if (
              task_json[u].status == "In-Progress" ||
              task_json[u].status == "Started"
            ) {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color: black;" class="Cbtn" id="showFormButton" onclick="seditTask('${task_json[u]._id}')">Update Status</button>
                                <p/><br></div>`;
              content = content + usr;
            } else {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}</span><span class='cell'>${task_json[u].End_Date}</span>
                                <button class="btn" id="showFormButton" onclick="seditTask('${task_json[u]._id}')">Update Status</button> <button style="margin-left:20px" class="btn" onclick="declineTask('${task_json[u]._id}')">Decline Task</button>
                                <p/><br></div>`;
              content = content + usr;
            }
            var element = document.getElementById("root");
            element.innerHTML = content + "</div>";
          }
        }
        if (flag == 0) {
          var element = document.getElementById("root");
          element.innerHTML =
            content +
            "<div class='user'>You have no tasks assigned so far</div></div>";
        }
      }
    }
  };
  htt.open("GET", "http://localhost:5000/task", true);
  htt.send();
}

var EID = localStorage.getItem("EMPLOYEEID");

//Task Display Function after search
function searchTasks() {
  const searchTerm = document.getElementById("taskSearch").value;
  const tableBody = document.getElementById("root");
  tableBody.innerHTML = ""; // Clear existing content
  var content = `<div class="links">
                <button> HEY ${username} ! HERE IS YOUR ASSIGNED TASKS </button>
        </div>
        <div class='table'><div class='user-header'><span class='headcell' id='taskIDHeader'>TASK ID
<div class="sort-buttons">
            <button onclick="sortData('taskID', 'asc')">▲</button>
            <button onclick="sortData('taskID', 'desc')">▼</button>
          </div>
        </span>
        <span class='headcell' id='taskNameHeader'>
          TASK NAME
          <div class="sort-buttons">
            <button onclick="sortData('taskName', 'asc')">▲</button>
            <button onclick="sortData('taskName', 'desc')">▼</button>
          </div>
        </span><span class='headcell' id='statusHeader'>
          STATUS
          <div class="sort-buttons">
            <button onclick="sortData('status', 'asc')">▲</button>
            <button onclick="sortData('status', 'desc')">▼</button>
          </div>
        </span><span class='headcell' id='endDateHeader'>
          END DATE
          <div class="sort-buttons">
            <button onclick="sortData('End_Date', 'asc')">▲</button>
            <button onclick="sortData('End_Date', 'desc')">▼</button>
          </div>
        </span></div>`;
  var htt = new XMLHttpRequest();
  htt.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        res = this.responseText;
        let flag = 0;
        var EID = localStorage.getItem("EMPLOYEEID");
        task_json = JSON.parse(res);
        for (let u in task_json) {
          console.log(typeof EID);
          if (EID == task_json[u].EmployeeID) {
            flag = 1;
            console.log("SSSS", task_json[u].status);
            if (task_json[u].status == "Completed") {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}</span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color: rgb(13, 97, 13);" class="Cbtn" disabled>Task Completed</button>
                                <p/><br></div>`;
              content = content + usr;
            } else if (task_json[u].status == "Declined") {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color:rgb(216, 24, 24);" class="Cbtn" disabled>Task Declined</button>
                                <p/><br></div>`;
              content = content + usr;
            } else if (
              task_json[u].status == "In-Progress" ||
              task_json[u].status == "Started"
            ) {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color: black;" class="Cbtn" id="showFormButton" onclick="seditTask('${task_json[u]._id}')">Update Status</button>
                                <p/><br></div>`;
              content = content + usr;
            } else {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}</span><span class='cell'>${task_json[u].End_Date}</span>
                                <button class="btn" id="showFormButton" onclick="seditTask('${task_json[u]._id}')">Update Status</button> <button style="margin-left:20px" class="btn" onclick="declineTask('${task_json[u]._id}')">Decline Task</button>
                                <p/><br></div>`;
              content = content + usr;
            }
            var element = document.getElementById("root");
            element.innerHTML = content + "</div>";
          }
        }
        if (flag == 0) {
          var element = document.getElementById("root");
          element.innerHTML =
            content +
            "<div class='user'>You have no tasks assigned so far</div></div>";
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

function getComments(Id) {
  document.getElementById("popupForm3").classList.remove("hidden3");
  var ind = task_json.findIndex((e) => e._id === Id);
  console.log(ind);
  document.getElementById("comment").value = task_json[ind].comment;
}

function closePopup1() {
  document.getElementById("popupForm3").classList.add("hidden3");
}

function sortData(field, order) {
  task_json.sort(function (a, b) {
    console.log("BS", task_json);
    var aValue = a[field];
    var bValue = b[field];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return order === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });
  console.log("AS", task_json);

  updateDisplay();
}

//Display task after filtering
function updateDisplay() {
  var content = `<div class="links">
                <button> HEY ${username} ! HERE IS YOUR ASSIGNED TASKS </button>
        </div><div class='table'><div class='user-header'><span class='headcell' id='taskIDHeader'>TASK ID
          <div class="sort-buttons">
            <button onclick="sortData('taskID', 'asc')">▲</button>
            <button onclick="sortData('taskID', 'desc')">▼</button>
          </div>
        </span>
        <span class='headcell' id='taskNameHeader'>
          TASK NAME
          <div class="sort-buttons">
            <button onclick="sortData('taskName', 'asc')">▲</button>
            <button onclick="sortData('taskName', 'desc')">▼</button>
          </div>
        </span><span class='headcell' id='statusHeader'>
          STATUS
          <div class="sort-buttons">
            <button onclick="sortData('status', 'asc')">▲</button>
            <button onclick="sortData('status', 'desc')">▼</button>
          </div>
        </span><span class='headcell' id='endDateHeader'>
          END DATE
          <div class="sort-buttons">
            <button onclick="sortData('End_Date', 'asc')">▲</button>
            <button onclick="sortData('End_Date', 'desc')">▼</button>
          </div>
        </span></div>`;
  var element = document.getElementById("root");
  element.innerHTML = content + "</div>";
  for (let u in task_json) {
    console.log(typeof EID);
    if (EID == task_json[u].EmployeeID) {
      flag = 1;
      console.log("SSSS", task_json[u].status);
      if (task_json[u].status == "Completed") {
        var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}</span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color: rgb(13, 97, 13);" class="Cbtn" disabled>Task Completed</button>
                                <p/><br></div>`;
        content = content + usr;
      } else if (task_json[u].status == "Declined") {
        var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color:rgb(216, 24, 24);" class="Cbtn" disabled>Task Declined</button>
                                <p/><br></div>`;
        content = content + usr;
      } else if (
        task_json[u].status == "In-Progress" ||
        task_json[u].status == "Started"
      ) {
        var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                                <button style="margin-left:20px;background-color: black;" class="Cbtn" id="showFormButton" onclick="seditTask('${task_json[u]._id}')">Update Status</button>
                                <p/><br></div>`;
        content = content + usr;
      } else {
        var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                                <span class='cell'>${task_json[u].status}</span><span class='cell'>${task_json[u].End_Date}</span>
                                <button class="btn" id="showFormButton" onclick="seditTask('${task_json[u]._id}')">Update Status</button> <button style="margin-left:20px" class="btn" onclick="declineTask('${task_json[u]._id}')">Decline Task</button>
                                <p/><br></div>`;
        content = content + usr;
      }
      var element = document.getElementById("root");
      element.innerHTML = content + "</div>";
    }
  }
}

//Decline Task
function declineTask(dlttsk) {
  var comment = prompt("Please provide a comment for declining the task:");
  if (comment !== null) {
    supstatus = "Declined";
    var xxhttp = new XMLHttpRequest();
    xxhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          console.log("Hai");
          display();
        }
      }
    };
  }
  xxhttp.open("PATCH", "http://localhost:5000/task/" + dlttsk, true);
  xxhttp.setRequestHeader("Content-type", "application/json");
  xxhttp.send(
    JSON.stringify({
      status: supstatus,
      Decline_Notification: true,
      comment: comment,
    })
  );
}

let STASKID;

function seditTask(tkId) {
  document.getElementById("popupForm").classList.remove("hidden");
  STASKID = tkId;
  var ind = task_json.findIndex((e) => e._id === tkId);
  console.log(ind);
  document.getElementById("supresence").value = task_json[ind].status;
}

//Update status of task
function updateStatus() {
  document.getElementById("popupForm").classList.add("hidden");
  var supstatus = document.getElementById("supresence").value;
  var comment = document.getElementById("comments").value;
  xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        display();
      }
    }
  };
  xhttp.open("PATCH", "http://localhost:5000/task/" + STASKID, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  if (supstatus == "Completed") {
    xhttp.send(
      JSON.stringify({
        status: supstatus,
        End_Date: new Date(Date.now()).toISOString().slice(0, 10),
        comment: comment,
      })
    );
  } else {
    xhttp.send(
      JSON.stringify({
        status: supstatus,
        comment: comment,
      })
    );
  }
  event.preventDefault();
  document.getElementById("supdateForm").reset();
}

function closePopup() {
  document.getElementById("popupForm").classList.add("hidden");
}
