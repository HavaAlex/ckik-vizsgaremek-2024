const express = require("express");

const router = express.Router();

const userAuth = require("../middlewares/userAuth")

const userController = require("../controllers/userController");

router.use("/",userAuth.verifyToken);

router.post("/register/:token", userController.createUser);

router.post("/orarendModositas/:token", userController.createUser);

router.post("/osztalyModositas/:token", userController.createUser);

module.exports = router;