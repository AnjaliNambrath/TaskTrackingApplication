const express = require('express')
const router = express.Router();

const taskController = require('../controllers/taskController')
var userHandlers = require('../controllers/userController.js');

//Login and Registration endpoints
router.get('/profile',userHandlers.loginRequired, userHandlers.profile)
router.post('/auth/register',userHandlers.register)
router.post('/auth/sign_in',userHandlers.sign_in)

//Admin Endpoints
router.get('/employee',taskController.getAllUser)
router.delete('/employee/:_id', taskController.deleteEmployee);
router.get("/task", taskController.getAllTask);
router.post("/task", taskController.createTask);
router.delete("/task/:_id", taskController.deleteTask);
router.get("/user/:employeeID", userHandlers.getUserByEmployeeID);

//User Endpoints
router.patch("/task/:_id", taskController.declineTask);
router.put("/task/:_id", taskController.updateTask);
router.patch("/task/:_id", taskController.updateStatus);

//Search Endpoints
router.get("/task/search", taskController.getSearchTask)
router.get("/employee/search", taskController.getSearchEmployee);

//Notification Endpoints
router.get("/task/notifications/:userId", taskController.getNotity)
router.get("/task/declinenotifications/:userId", taskController.getAdminNotity);

//Endpoints to check data is unique
router.get("/checkempid", taskController.CheckEmpID);
router.get("/checkemail", taskController.CheckEmail);
router.get("/checktskid", taskController.CheckTask);

module.exports = router;