const express = require("express");
const multer = require("multer");
const router = express.Router();

console.log("teszt3");

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
const user = require("../models/user");

const tanarHandler = require("../middlewares/tanarHandler")

// Make sure to protect all routes with your auth middleware
router.use(userAuth.verifyToken);

router.get("/", jegyController.getJegyek);

router.use(tanarHandler.checkRole);
router.post("/", jegyController.createJegy);
router.get("/csoportjegy", jegyController.getJegyekTanar);

module.exports = router;
