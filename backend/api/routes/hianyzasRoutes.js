const express = require("express");
const router = express.Router();

const userAuth = require("../middlewares/userAuth");


const absenceController = require("../controllers/absenceController");


// Middleware ellenőrzés
router.use(userAuth.verifyToken);

router.get("/", absenceController.getAbsences);
router.get("/getAllAbsences", absenceController.getAllAbsences);
router.get("/getStudentsInGroup/:groupID", absenceController.getStudentsInGroup);
router.post("/postAbsence", absenceController.postAbsence);
router.get("/:id", absenceController.getAbsences);
router.post("/", absenceController.getAbsences);
module.exports = router;
