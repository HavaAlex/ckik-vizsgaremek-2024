const express = require("express");

const router = express.Router();
console.log("teszt4")

const orarendController = require("../controllers/orarendController");

router.post("/group", orarendController.createGroup);

router.get("/group", orarendController.createGroup);

module.exports = router;