const user = require('../models/userModel')
const task = require("../models/taskModel");
const fs = require('fs');
exports.getAllUser = async(req,res)=>{
    try{
        const getUser = await user.find({})
        res.send(getUser)
    }
    catch(err){
    console.error('Error getting Users', err);
    res.status(500).send('Error getting Users');
  } 
}

exports.deleteEmployee = async (req, res) => {
  const empId = req.params._id;
  try{
    const empByid= await user.findByIdAndDelete(empId);
    res.send({message:'Employee deleted successfully',deleteEmployee:empByid});
  }catch(err){
    console.error('Error deleting Employee', err);
    res.status(500).send('Error deleting Employee');
  } 
};

exports.deleteTask = async (req, res) => {
  const taskId = req.params._id;
  try {
    const empByid = await task.findByIdAndDelete(taskId);
    res.send({
      message: "Task deleted successfully",
      deleteTask: empByid,
    });
  } catch (err) {
    console.error("Error deleting Task", err);
    res.status(500).send("Error deleting Task");
  }
};

exports.getAllTask = async (req, res) => {
  try {
    const getTask = await task.find({});
    res.send(getTask);
  } catch (err) {
    console.error("Error getting Tasks", err);
    res.status(500).send("Error getting Tasks");
  }
};

//Checking for new task for particular employee
exports.getNotity = async (req, res) => {
  try {
    const userId = req.params.userId;
    const newTasks = await task.find({ EmployeeID: userId, New_Notification: true });

    newTasks.forEach(async (task) => {
      task.New_Notification = false;
      await task.save();
    });

    res.json(newTasks);
  } catch (err) {
    console.error("Error getting new tasks", err);
    res.status(500).json({ error: "Error getting new tasks" });
  }
}

//Checking for tasks that has been declined by the employee
exports.getAdminNotity = async (req, res) => {
  try {
    const userId = req.params.userId;
    const newTasks = await task.find({
      EmployeeID: userId,
      Decline_Notification: true,
    });

    newTasks.forEach(async (task) => {
      task.Decline_Notification = false;
      await task.save();
    });

    res.json(newTasks);
  } catch (err) {
    console.error("Error getting decline tasks", err);
    res.status(500).json({ error: "Error getting decline tasks" });
  }
};

//To Check whether EmployeeId is Unique
exports.CheckEmpID = async (req, res) => {
  try {
    console.log(req.query.EmployeeID);
    const EmId = req.query.EmployeeID;
    const foundEmp = await user.findOne({EmployeeID: EmId });
    res.json({ unique: foundEmp });
    
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Error" });
  }
};

//To Check whether EmailId is Unique
exports.CheckEmail = async (req, res) => {
  try {
    const eml = req.query.email;
    const foundEmail = await user.findOne({ email: eml });
    res.json({ uniqueemail: foundEmail });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Error" });
  }
};

//To Check whether TaskId is Unique
exports.CheckTask = async (req, res) => {
  try {
    const tsk = req.query.taskID;
    const foundTask = await task.findOne({ taskID: tsk });
    res.json({ uniquetask: foundTask });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Error" });
  }
};

exports.getSearchTask = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const searchRegex = new RegExp(searchTerm, "i");

    const tasks = await task.find({
      $or: [
        // { taskID: searchTerm },
        { taskName: { $regex: searchRegex } },
        { status: { $regex: searchRegex } },
        { End_Date: { $regex: searchRegex } },
      ],
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error getting tasks", err);
    res.status(500).json({ error: "Error getting tasks" });
  }
};

exports.getSearchEmployee = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const searchRegex = new RegExp(searchTerm, "i");

    const tasks = await user.find({
      $or: [
        { email: { $regex: searchRegex } },
        { fullName: { $regex: searchRegex } },
      ],
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error getting employee", err);
    res.status(500).json({ error: "Error getting employee" });
  }
};


exports.createTask = async (req, res) => {
  try {
    console.log(req.body);
    var c = fs.readFileSync("./controllers/count.txt");
    c++;
    fs.writeFileSync("./controllers/count.txt", c.toString());
    console.log(c);
    req.body.taskID = c;
    const addTask = await task.create(req.body);
    console.log("Task Added Successfully");
    res.status(200).json(addTask);
  } catch (error) {
    console.error("Error");
    res.status(500).send("Error");
  }
};

exports.declineTask = async (req, res) => {
  const taskId = req.params._id;
  const declinetask = req.body;
  console.log(declinetask);
  try {
    console.log("Reached");
    const taskByid = await task.findByIdAndUpdate(taskId, declinetask,);
    res.send({
      message: "Task declined successfully",declineTask: taskByid});
  } catch (err) {
    console.error("Error declining Task", err);
    res.status(500).send("Error declining Task");
  }
};

exports.updateTask = async (req, res) => {
  const cId = req.params._id;
  const updatedTask = req.body;
  try {
    const updateByid = await task.findByIdAndUpdate(
      cId,
      updatedTask,
    );
    res.send({
      message: "Task Updated successfully",
    });
  } catch (err) {
    console.error("Error updating Task", err);
    res.status(500).send("Error updating Task");
  }
};

exports.updateStatus = async (req, res) => {
  const sId = req.params._id;
  const updatedStatus = req.body;
  try {
    const supdateByid = await task.findByIdAndUpdate(sId, updatedStatus);
    res.send({
      message: "Status Updated successfully",
    });
  } catch (err) {
    console.error("Error updating Status", err);
    res.status(500).send("Error updating Status");
  }
};

