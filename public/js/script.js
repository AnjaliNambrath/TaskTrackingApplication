
function userLogin(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status==200){
                console.log("token");
                var restoken = JSON.parse(this.responseText);
                localStorage.setItem("token",JSON.stringify(restoken.token))
                localStorage.setItem("EMPLOYEEID", restoken.EmployeeID);
                localStorage.setItem("USER", restoken.fullName);
                checkUser(restoken)
            }
        }
    }
    xhttp.open("POST","http://localhost:5000/auth/sign_in",true)
    xhttp.setRequestHeader("Content-type","application/json")
    xhttp.send(JSON.stringify({email:email,password:password
    }))
    event.preventDefault();
}

function userRegister(){
    var empid = document.getElementById('empid').value;
    var name = document.getElementById('name').value;
    var emailid = document.getElementById('emailid').value;
    var pass = document.getElementById('pass').value;
    var xhhttp = new XMLHttpRequest();
    xhhttp.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status==200){ 
                location.href = "/userlogin.html";        
                alert('Successfully Registered, Plaese Sign In')
            }
        }
    }
    xhhttp.open("POST","http://localhost:5000/auth/register",true)
    xhhttp.setRequestHeader("Content-type","application/json")
    xhhttp.send(JSON.stringify({EmployeeID:empid,fullName:name,email:emailid,password:pass
    }))
    event.preventDefault();
}

function checkEmpIDUnique(){
    var Empid = document.getElementById("empid").value;
    var ttp = new XMLHttpRequest();
    ttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var res = JSON.parse(this.responseText)
          console.log(res);
          if(res.unique){
              document.getElementById("idError").innerHTML =
                "Employee ID already registered!<br>Please use a different Employee ID";
          document.getElementById("empid").value ='';
          }else{
              document.getElementById("idError").innerHTML = "";
          }
        }
      }
    };
    ttp.open("GET", `http://localhost:5000/checkempid?EmployeeID=${Empid}`, true);
    ttp.send();
}

function checkEmailUnique() {
  var Email = document.getElementById("emailid").value;
  var ttp = new XMLHttpRequest();
  ttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var res = JSON.parse(this.responseText);
        console.log(res);
        if (res.uniqueemail) {
          document.getElementById("idError").innerHTML =
            "Email ID already registered!<br>Please use a different Email ID";
          document.getElementById("emailid").value = "";
        } else {
          document.getElementById("idError").innerHTML = "";
        }
      }
    }
  };
  ttp.open("GET", `http://localhost:5000/checkemail?email=${Email}`, true);
  ttp.send();
}

function checkUser(restoken){
    var xxhttp = new XMLHttpRequest();
    xxhttp.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status==200){               
                var res = JSON.parse(this.responseText);
                console.log(this.responseText);
                if(res.email=="admin@gmail.com"){
                    location.href='/AdminViewAll.html'
                }
                else{               
                location.href='/dashboard.html'
                }
                
            }else{
                console.log(this.responseText);
                var res = JSON.parse(this.responseText);
                location.href='/userlogin.html'
                alert(res.message+" Try Again!")
            }
        }
    }
    xxhttp.open("GET","http://localhost:5000/profile",true)
    // xxhttp.setRequestHeader("Content-Type","application/json")
    xxhttp.setRequestHeader('Authorization','JWT '+restoken.token)
    xxhttp.send()
    event.preventDefault();
}