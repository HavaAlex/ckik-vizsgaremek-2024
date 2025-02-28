const express = require("express");
const multer = require("multer");
const router = express.Router();

console.log("teszt3");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userAuth = require("../middlewares/userAuth");

const orarendController = require("../controllers/orarendController");
const userController = require("../controllers/userController");
const uzenetController = require("../controllers/uzenetController");
const absenceController = require("../controllers/absenceController");
const jegyController = require("../controllers/jegyController");
const hazikController = require("../controllers/hazikController");
const user = require("../models/user");

// Make sure to protect all routes with your auth middleware
router.use(userAuth.verifyToken);

router.get("/uzenetek", uzenetController.getUzenetek);
router.get("/uzenetekreceivers", uzenetController.getPotentialReceivers);
router.post("/uzenetek", uzenetController.createUzenet);

router.get("/orarend", orarendController.getOrarend);
router.get("/jegyek", jegyController.getJegyek);
router.post("/jegyek", orarendController.getOrarend);

router.get("/hianyzasok", absenceController.getAbsences);
router.post("/hianyzasok", orarendController.getOrarend);

router.get("/fiokadatok", userController.getUser);
router.post("/fiokadatok", orarendController.getOrarend);

router.get("/gyerekek", userController.getGuardiansChildren);

router.get("/hazikGroups", hazikController.getGroups);
router.get("/haziktanar", hazikController.getsentAssignments);
router.get("/hazikdiak",hazikController.getReceivedAssignments)
router.post("/newassignment", hazikController.postAssignment);

router.patch("/modifycompletedassignment",hazikController.modifycompletedassignment)

router.post("/getAssignmentFiles",hazikController.getAssignmentFiles)
router.post("/getCompletedAssignmentFiles",hazikController.getCompletedAssignmentFiles)
// <-- IMPORTANT: Use upload.array("files") on this route
router.post(
  "/uploadassignmentfiles",
  upload.array("files"),
  hazikController.uploadAssignmentFiles
);

router.post(
  "/uploadcompletedassignmentfiles",
  upload.array("files"),
  hazikController.uploadCompletedAssignmentFiles
)

module.exports = router;
