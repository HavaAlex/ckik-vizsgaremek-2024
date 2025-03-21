const express = require("express");

const router = express.Router();

const orarendController = require("../controllers/orarendController");

const userAuth = require("../middlewares/userAuth")

router.use(userAuth.verifyToken);

router.get("/", orarendController.getOrarend);


module.exports = router;