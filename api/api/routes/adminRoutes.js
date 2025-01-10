const express = require("express");

const router = express.Router();

const paholyController = require("../controllers/paholyController");
const userController = require("../controllers/userController");

router.post("/register/:token", userController.createUser);

router.post("/orarendModositas/:token", paholyController);

router.post("/osztalyModositas/:token", paholyController);

module.exports = router;