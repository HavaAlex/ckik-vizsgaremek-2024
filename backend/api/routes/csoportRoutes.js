const express = require("express");

const router = express.Router();


const userAuth = require("../middlewares/userAuth")

const groupController = require("../controllers/groupController")

const tanarHandler = require("../middlewares/tanarHandler")

router.use(userAuth.verifyToken);

router.get("/tanarcsoport",tanarHandler.checkRole,  groupController.getTeacherGroups);

router.get("/csoporttag",tanarHandler.checkRole,  groupController.getTeacherGroupMembers);

module.exports = router;