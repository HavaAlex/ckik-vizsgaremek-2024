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

/**
 * @swagger
 * /jegy:
 *   get:
 *     tags:
 *       - Jegyek
 *     description: Felhasználó jegyeinek lekérdezése
 *     requestBody:
 *       required: false
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Mark'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mark'
 *     responses:
 *       201:
 *         description: Sikeres jegy lekérés
 *         content:
 *           application/json:
 *              example:
 *                  name: "Fehér Napsugár"
 *                  password: "hashed password"
 *                  age: 14
 *                  updatedAt: "The last time of the user modified their data"
 *                  createdAt: "The time of the user created"
 *       400:
 *         description: Hiba a jegy lekérése közben
 *         content:
 *           application/json:
 *              example:
 *                  status: "400"
 *                  message: "The message of the error"
 * 
 */

router.get("/", jegyController.getJegyek);
router.get("/:id", jegyController.getJegyekSzulo);
router.post("/",tanarHandler.checkRole, jegyController.createJegy);
router.get("/csoportjegy",tanarHandler.checkRole, jegyController.getJegyekTanar);

module.exports = router;
