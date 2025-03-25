const express = require("express");
const multer = require("multer");
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userAuth = require("../middlewares/userAuth");

const orarendController = require("../controllers/orarendController");
const userController = require("../controllers/userController");
const uzenetController = require("../controllers/uzenetController");
const absenceController = require("../controllers/absenceController");
const jegyController = require("../controllers/jegyController");
const hazikController = require("../controllers/hazikController");
const adminController = require("../controllers/adminController");
const user = require("../models/user");
const tanarHandler = require("../middlewares/tanarHandler")

// Make sure to protect all routes with your auth middleware
router.use(userAuth.verifyToken);

//Alex dolga (ne piszkáld légyszi)
router.get("/hazikGroups", hazikController.getGroups);
router.get("/haziktanar",tanarHandler.checkRole, hazikController.getsentAssignments);
router.get("/hazikdiak",hazikController.getReceivedAssignments)
router.post("/newassignment",tanarHandler.checkRole,  hazikController.postAssignment);

router.patch("/modifycompletedassignment",hazikController.modifycompletedassignment)

router.get("/getAssignmentFiles/",hazikController.getAssignmentFiles)
router.post("/getCompletedAssignmentFiles/",hazikController.getCompletedAssignmentFiles)
router.delete("/deleteAssignment/:assignmentId",tanarHandler.checkRole, hazikController.deleteAssignment)
router.delete("/deleteAnswerFile/:fileId",hazikController.deleteCompletedAssignmentFile)
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
