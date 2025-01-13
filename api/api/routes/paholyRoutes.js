const express = require("express");

const router = express.Router();

const paholyController = require("../controllers/paholyController");

router.get("/", [ userAuth.verifyToken ], userController.getUsers);

router.post("/login", userController.loginUser);

router.get("/orarend/:token", paholyController.getOrarend);

router.get("/jegyek/:token", paholyController);

router.post("/jegyek/:token", paholyController);

router.get("/hianyzasok/:token", paholyController);

router.post("/hianyzasok/:token", paholyController);

router.get("/hianyzasokOsztaly/:token", paholyController);

router.post("/hianyzasokOsztaly/:token", paholyController);

router.get("/fiokadatok/:token", paholyController);

router.post("/fiokadatok/:token", paholyController);

router.post("admin/orarendModositas/:token", paholyController);

router.post("admin/osztalyModositas/:token", paholyController);

router.get("/uzenetek/:token", paholyController);

router.post("/uzenetek/:token", paholyController);

module.exports = router;