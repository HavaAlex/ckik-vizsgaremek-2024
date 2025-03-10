const express = require("express");

const router = express.Router();

const userAuth = require("../middlewares/userAuth")

const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");

const adminHandler = require("../middlewares/adminHandler")

router.use(userAuth.verifyToken,adminHandler.checkRole);

router.post("/register/:token", userController.createUser);

router.post("/orarendModositas/:token", userController.createUser);

router.post("/osztalyModositas/:token", userController.createUser);



module.exports = router;