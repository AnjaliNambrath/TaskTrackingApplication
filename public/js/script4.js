
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

var task_json = [];
//Task Display Function
function display() {
  var content = `<div class='table'><div class='user-header'><span class='headcell' id='taskIDHeader'>TASK ID
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
        </span><span class='headcell' id='assignedToHeader'>
          ASSIGNED TO
          <div class="sort-buttons">
            <button onclick="sortData('fullName', 'asc')">▲</button>
            <button onclick="sortData('fullName', 'desc')">▼</button>
          </div>
        </span></div>`;
  
    var htt = new XMLHttpRequest();
  htt.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        res = this.responseText;
        task_json = JSON.parse(res);
        for (let u in task_json) {
            getUserInfo(task_json[u].EmployeeID, function (userInfo) {
              var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                    <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                    <span class='cell'>${userInfo.fullName}</span><p/><br></div>`;
              content = content + usr;
              var element = document.getElementById("root");
              element.innerHTML = content + "</div>";
            });
        }
      }
    }
  };
  htt.open("GET", "http://localhost:5000/task", true);
  htt.send();
}

function sortData(field, order) {
  task_json.sort(function (a, b) {
    console.log("BS",task_json);
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
  var content = `<div class='table'><div class='user-header'><span class='headcell' id='taskIDHeader'>TASK ID
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
        </span><span class='headcell' id='assignedToHeader'>
          ASSIGNED TO
          <div class="sort-buttons">
            <button onclick="sortData('fullName', 'asc')">▲</button>
            <button onclick="sortData('fullName', 'desc')">▼</button>
          </div>
        </span></div>`;
  var element = document.getElementById("root");
  element.innerHTML = content + "</div>";
  for (let u in task_json) {
    getUserInfo(task_json[u].EmployeeID, function (userInfo) {
      var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                <span class='cell'>${userInfo.fullName}</span><p/><br></div>`;
      content = content + usr;
      var element = document.getElementById("root");
      element.innerHTML = content + "</div>";
    });
  }
}

function getUserInfo(employeeID, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var userInfo = JSON.parse(this.responseText);
        callback(userInfo);
      }
    }
  };
  xhr.open("GET", `http://localhost:5000/user/${employeeID}`, true);
  xhr.send();
}

//Task Display Function after search
function searchTasks() {
  const searchTerm = document.getElementById("Searchtask").value;
  const tableBody = document.getElementById("root");
  tableBody.innerHTML = ""; // Clear existing content
  var content = `<div class='table'><div class='user-header'><span class='headcell' id='taskIDHeader'>TASK ID
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
        </span><span class='headcell' id='assignedToHeader'>
          ASSIGNED TO
          <div class="sort-buttons">
            <button onclick="sortData('fullName', 'asc')">▲</button>
            <button onclick="sortData('fullName', 'desc')">▼</button>
          </div>
        </span></div>`;
  var htt = new XMLHttpRequest();
  htt.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        res = this.responseText;
        task_json = JSON.parse(res);
        for (let u in task_json) {
          getUserInfo(task_json[u].EmployeeID, function (userInfo) {
            var usr = `<div class='user'><span class='cell'>${task_json[u].taskID}</span><span class='cell'>${task_json[u].taskName}</span>  
                    <span class='cell'>${task_json[u].status}<button title="Click to see comments" id="showFormButton" onclick="getComments('${task_json[u]._id}')"><i class="bi bi-chat-left-text"></i></button></span><span class='cell'>${task_json[u].End_Date}</span>
                    <span class='cell'>${userInfo.fullName}</span><p/><br></div>`;
            content = content + usr;
            var element = document.getElementById("root");
            element.innerHTML = content + "</div>";
          });
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
  document.getElementById("popupForm2").classList.remove("hidden2");
  var ind = task_json.findIndex((e) => e._id === Id);
  console.log(ind);
  document.getElementById("comm").value = task_json[ind].comment;
}

function closePopup() {
  document.getElementById("popupForm2").classList.add("hidden2");
}