const express = require("express");

const router = express.Router();
console.log("teszt3")

const userAuth = require("../middlewares/userAuth")

const orarendController = require("../controllers/orarendController");

const userController = require("../controllers/userController")

const uzenetController = require("../controllers/uzenetController")

const hianyzasController = require("../controllers/hianyzasController")

const jegyController = require("../controllers/jegyController")

const groupController = require("../controllers/groupController")

const tanarHandler = require("../middlewares/tanarHandler")

router.use(userAuth.verifyToken);

router.use(tanarHandler.checkRole)

router.get("/tantargy", orarendController.getTantargyakTanar);


module.exports = router;