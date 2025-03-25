const express = require("express");

const router = express.Router();
console.log("teszt3")

const userController = require("../controllers/userController");

router.post("/", userController.loginUser);

router.post("/changePassword", userController.changePassword)

module.exports = router;