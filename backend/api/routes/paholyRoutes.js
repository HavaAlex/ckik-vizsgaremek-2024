const express = require("express");

const router = express.Router();
console.log("teszt3")

const userAuth = require("../middlewares/userAuth")

const orarendController = require("../controllers/orarendController");

const userController = require("../controllers/userController")

const uzenetController = require("../controllers/uzenetController")

router.get("/", [ userAuth.verifyToken ]);

router.get("/orarend/:token",orarendController.getOrarend);

router.get("/jegyek/:token",orarendController.getOrarend);

router.post("/jegyek/:token", orarendController.getOrarend);

router.get("/hianyzasok/:token", orarendController.getOrarend);

router.post("/hianyzasok/:token", orarendController.getOrarend);

router.get("/hianyzasokOsztaly/:token", orarendController.getOrarend);

router.post("/hianyzasokOsztaly/:token", orarendController.getOrarend);

router.get("/fiokadatok/:token", orarendController.getOrarend);

router.post("/fiokadatok/:token", orarendController.getOrarend);

router.post("admin/orarendModositas/:token", orarendController.getOrarend);

router.post("admin/osztalyModositas/:token", orarendController.getOrarend);

router.get("/uzenetek/:token", uzenetController.getUzenetek);

router.post("/uzenetek/:token", orarendController.getOrarend);

module.exports = router;
