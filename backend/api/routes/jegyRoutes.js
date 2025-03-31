const express = require("express");
const multer = require("multer");
const router = express.Router();



const storage = multer.memoryStorage();

const userAuth = require("../middlewares/userAuth");


const jegyController = require("../controllers/jegyController");

const tanarHandler = require("../middlewares/tanarHandler")


router.use(userAuth.verifyToken);

router.get("/", jegyController.getJegyek);
router.get("/csoportjegy",tanarHandler.checkRole, jegyController.getJegyekTanar);
router.get("/:id", jegyController.getJegyekSzulo);
router.post("/",tanarHandler.checkRole, jegyController.createJegy);

module.exports = router;
