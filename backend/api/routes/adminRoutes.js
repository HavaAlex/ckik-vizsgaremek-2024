const express = require("express");

const router = express.Router();

const userAuth = require("../middlewares/userAuth")

const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const uzenetController = require("../controllers/uzenetController")
const orarendController = require("../controllers/orarendController")

const adminHandler = require("../middlewares/adminHandler");
const adminService = require("../services/adminService");

router.use(userAuth.verifyToken);


router.post("/addTeacherUsers",adminHandler.checkRole,adminController.uploadTeachers)//Tanárok feltöltése
router.post("/addStudentUsers",adminHandler.checkRole,adminController.uploadStudents)//Diákok feltöltése
router.post("/addGuardianUsers",adminHandler.checkRole,adminController.addGuardianUsers)//Szülők/gondviselők feltöltése
router.get("/getAllUsers",adminHandler.checkRole,adminController.getAllUsers)//Összes felhasználó lekérése
router.get("/getAllStudents",adminHandler.checkRole,adminController.getAllStudents)//Összes Diák lekérése
router.get("/getUser/:userID",adminHandler.checkRole,userController.getUserWithAdditionalAttributes)// egy felhasználó lekérése
router.put("/modifyUser",adminHandler.checkRole,adminController.modifyUser)//Felhasználó utólagos módosítása, adminra, studentre, teacherre és guardiannre egyaránt működik
router.put("/modifyAbsence",adminHandler.checkRole,adminController.modifyAbsence)//Egy hiányzás leigozálasa vagy annak viszavonása
router.delete("/deleteUser/:userID",adminHandler.checkRole,adminController.deleteUser)//Felhasználó törlése
router.delete("/deleteAbsence/:userID",adminHandler.checkRole,adminController.deleteAbsence)//Hiányzás törlése
router.post("/addStudentsToGuardian", adminHandler.checkRole, adminController.addStudentsToGuardian)
router.get("/getAbsences/",adminHandler.checkRole, adminController.getAbsences),

router.get("/getAllGroupsWithStudents",adminHandler.checkRole,adminController.getAllGroupsWithStudents)//csoportok lekérése, a benne lévő studentekkel együtt
router.post("/createGroup",adminHandler.checkRole,adminController.CreateGroup)//Csoport létrehozása, diákokkal együtt történik
router.post("/addStudentsToGroup",adminHandler.checkRole,adminController.addStudentsToGroup)//Felhasználók utólagos hozzáadása a csoporhoz
router.delete("/deleteStudentGroup/:ID",adminHandler.checkRole,adminController.deleteStudentGroup)//Diák eltávolítása a csoportból (nem törli ki a felhasználót)
router.delete("/deleteGroup/:ID",adminHandler.checkRole,adminController.deleteGroup)//Csoport törlése (Nem törli ki a felhasználókat, de a kapcsolótábla adatait igen)
router.get("/getGroupAsignments/:GroupID",adminHandler.checkRole,adminController.getGroupAsignments)//csoporthoz tartozó házifeladatok lekérése
router.get("/allMessage",adminHandler.checkRole,uzenetController.getAllMessages);
router.delete("/deleteMessage/:ID",adminHandler.checkRole,uzenetController.deleteMessage)
router.get("/timetable/:id",adminHandler.checkRole,adminController.getOrarend);
router.get("/allgroups",adminHandler.checkRole,adminController.getAllGroups);
router.post("/addLessons",adminHandler.checkRole,adminController.uploadLessons)
router.get("/allteachers",adminHandler.checkRole,adminController.getAllTeachers);
router.put("/addDisruption",adminHandler.checkRole,adminController.uploadDisruption)
router.delete("/deleteLesson/:ID",adminHandler.checkRole,adminController.deleteLesson)
router.post("/modifyLesson/",adminHandler.checkRole,adminController.modifyLesson)

module.exports = router;