const express = require("express");

const router = express.Router();


const userAuth = require("../middlewares/userAuth")

const orarendController = require("../controllers/orarendController");

const userController = require("../controllers/userController")

const uzenetController = require("../controllers/uzenetController")

const jegyController = require("../controllers/jegyController")

const groupController = require("../controllers/groupController")

const tanarHandler = require("../middlewares/tanarHandler")

router.use(userAuth.verifyToken);

router.get("/tanarcsoport",tanarHandler.checkRole,  groupController.getTeacherGroups);

router.get("/csoporttag",tanarHandler.checkRole,  groupController.getTeacherGroupMembers);

module.exports = router;