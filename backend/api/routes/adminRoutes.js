const express = require("express");

const router = express.Router();

const userAuth = require("../middlewares/userAuth")

const userController = require("../controllers/userController");

router.get("/", [ userAuth.verifyToken ], userController.getUsers);

router.post("/register/:token", userController.createUser);

router.post("/orarendModositas/:token", userController.getUsers);

router.post("/osztalyModositas/:token", userController.getUsers);

module.exports = router;