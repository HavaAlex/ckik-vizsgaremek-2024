const express = require("express");

const router = express.Router();

const orarendController = require("../controllers/orarendController");

router.get("/orarend", orarendController.getOrarend);


module.exports = router;