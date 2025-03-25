const express = require("express");
const multer = require("multer");
const router = express.Router();



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userAuth = require("../middlewares/userAuth");

const orarendController = require("../controllers/orarendController");
const userController = require("../controllers/userController");
const uzenetController = require("../controllers/uzenetController");
const absenceController = require("../controllers/absenceController");
const jegyController = require("../controllers/jegyController");
const hazikController = require("../controllers/hazikController");
const adminController = require("../controllers/adminController");
const szuloController = require("../controllers/szuloController");
const szuloHandler = require("../middlewares/szuloHandler")
const user = require("../models/user");

// Make sure to protect all routes with your auth middleware
router.use(userAuth.verifyToken);

router.get("/orarend/:id",szuloHandler.checkRole, szuloController.getOrarend)
router.get("/jegy/:id",szuloHandler.checkRole,szuloController.getOrarend)
router.get("/feladat/:id",szuloHandler.checkRole,szuloController.getOrarend)
router.get("/hianyzas/:id",szuloHandler.checkRole,szuloController.getOrarend)

module.exports = router;
