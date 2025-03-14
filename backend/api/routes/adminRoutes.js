const express = require("express");

const router = express.Router();

const userAuth = require("../middlewares/userAuth")

const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");

const adminHandler = require("../middlewares/adminHandler")

router.use(userAuth.verifyToken);

router.use(adminHandler.checkRole);

router.post("/register/:token", userController.createUser);

router.post("/orarendModositas/:token", userController.createUser);

router.post("/osztalyModositas/:token", userController.createUser);

router.post("/addTeacherUsers",adminController.uploadTeachers)
router.post("/addStudentUsers",adminController.uploadStudents)
router.post("/addGuardianUsers",adminController.addGuardianUsers)
router.get("/getAllUsers",adminController.getAllUsers)
router.get("/getUser/:userID",userController.getUserWithAdditionalAttributes)
router.put("/modifyUser",adminController.modifyUser)
router.delete("/deleteUser/:userID",adminController.deleteUser)

router.get("/getAllGroupsWithStudents",adminController.getAllGroupsWithStudents)
router.post("/createGroup",adminController.CreateGroup)

module.exports = router;