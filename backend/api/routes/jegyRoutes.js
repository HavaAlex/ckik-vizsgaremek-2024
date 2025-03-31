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
const user = require("../models/user");

const tanarHandler = require("../middlewares/tanarHandler")


router.use(userAuth.verifyToken);

router.get("/", jegyController.getJegyek);
router.get("/csoportjegy",tanarHandler.checkRole, jegyController.getJegyekTanar);
router.get("/:id", jegyController.getJegyekSzulo);
router.post("/",tanarHandler.checkRole, jegyController.createJegy);

module.exports = router;
