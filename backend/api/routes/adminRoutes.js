const express = require("express");

const router = express.Router();

const userAuth = require("../middlewares/userAuth")

const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const uzenetController = require("../controllers/uzenetController")

const adminHandler = require("../middlewares/adminHandler");
const adminService = require("../services/adminService");

router.use(userAuth.verifyToken);

router.use(adminHandler.checkRole);

router.post("/register/:token", userController.createUser);

router.post("/orarendModositas/:token", userController.createUser);

router.post("/osztalyModositas/:token", userController.createUser);

router.post("/addTeacherUsers",adminController.uploadTeachers)//Tanárok feltöltése
router.post("/addStudentUsers",adminController.uploadStudents)//Diákok feltöltése
router.post("/addGuardianUsers",adminController.addGuardianUsers)//Szülők/gondviselők feltöltése
router.get("/getAllUsers",adminController.getAllUsers)//Összes felhasználó lekérése
router.get("/getUser/:userID",userController.getUserWithAdditionalAttributes)// egy felhasználó lekérése
router.put("/modifyUser",adminController.modifyUser)//Felhasználó utólagos módosítása, adminra, studentre, teacherre és guardiannre egyaránt működik
router.delete("/deleteUser/:userID",adminController.deleteUser)//Felhasználó törlése

router.get("/getAllGroupsWithStudents",adminController.getAllGroupsWithStudents)//csoportok lekérése, a benne lévő studentekkel együtt
router.post("/createGroup",adminController.CreateGroup)//Csoport létrehozása, diákokkal együtt történik
router.post("/addStudentsToGroup",adminController.addStudentsToGroup)//Felhasználók utólagos hozzáadása a csoporhoz
router.delete("/deleteStudentGroup/:ID",adminController.deleteStudentGroup)//Diák eltávolítása a csoportból (nem törli ki a felhasználót)
router.delete("/deleteGroup/:ID",adminController.deleteGroup)//Csoport törlése (Nem törli ki a felhasználókat, de a kapcsolótábla adatait igen)
router.get("/getGroupAsignments/:GroupID",adminController.getGroupAsignments)//csoporthoz tartozó házifeladatok lekérése
router.get("/allMessage",uzenetController.getAllMessages);
router.delete("/deleteMessage/:ID",uzenetController.deleteMessage)

module.exports = router;