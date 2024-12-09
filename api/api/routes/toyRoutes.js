const express = require("express");

const router = express.Router();

const toyController = require("../controllers/toyController");

router.get("/", toyController.getAllToys);

router.post(["/create", "/new"], toyController.createToy);

router.get("/:index", toyController.getToy);

module.exports = router;