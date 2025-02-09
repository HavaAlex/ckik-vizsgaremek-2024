const express = require("express");

const router = express.Router();
console.log("teszt3")

const userAuth = require("../middlewares/userAuth")

const orarendController = require("../controllers/orarendController");

const userController = require("../controllers/userController")

const uzenetController = require("../controllers/uzenetController")

const hianyzasController = require("../controllers/hianyzasController")

const jegyController = require("../controllers/jegyController")

router.use(userAuth.verifyToken);

router.get("/uzenetek", uzenetController.getUzenetek);

router.get("/uzenetekreceivers", uzenetController.getPotentialReceivers);

router.post("/uzenetek", uzenetController.createUzenet);

router.get("/orarend",orarendController.getOrarend);

router.get("/jegyek",jegyController.getJegyek);

router.post("/jegyek", orarendController.getOrarend);

router.get("/hianyzasok", hianyzasController.getHianyzasokDiak);

router.post("/hianyzasok", orarendController.getOrarend);

router.get("/fiokadatok", userController.getUser);

router.post("/fiokadatok", orarendController.getOrarend);

module.exports = router;
