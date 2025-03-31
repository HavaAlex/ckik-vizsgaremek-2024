const express = require("express");

const router = express.Router();


const userAuth = require("../middlewares/userAuth")

const orarendController = require("../controllers/orarendController");



const tanarHandler = require("../middlewares/tanarHandler")

router.use(userAuth.verifyToken);

router.get("/tantargy",tanarHandler.checkRole, orarendController.getTantargyakTanar);


module.exports = router;