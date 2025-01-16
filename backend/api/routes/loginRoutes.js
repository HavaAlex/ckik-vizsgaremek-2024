const express = require("express");

const router = express.Router();
console.log("teszt3")

const userController = require("../controllers/userController");

router.post("/login", userController.loginUser);