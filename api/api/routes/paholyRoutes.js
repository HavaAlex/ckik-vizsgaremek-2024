const express = require("express");

const router = express.Router();

const paholyController = require("../controllers/paholyController");

router.post("/login", paholyController);

router.get("/orarend/:token", paholyController.getOrarend);

router.get("/jegyek/:token", paholyController);

router.post("/jegyek/:token", paholyController);

router.get("/hianyzasok/:token", paholyController);

router.post("/hianyzasok/:token", paholyController);

router.get("/hianyzasokOsztaly/:token", paholyController);

router.post("/hianyzasokOsztaly/:token", paholyController);

router.get("/fiokadatok/:token", paholyController);

router.post("/fiokadatok/:token", paholyController);

router.post("/orarendModositas/:token", paholyController);

router.post("/osztalyModositas/:token", paholyController);

router.get("/uzenetek/:token", paholyController);

router.post("/uzenetek/:token", paholyController);

module.exports = router;