const express = require("express");

const router = express.Router();

const orarendController = require("../controllers/orarendController");

const userAuth = require("../middlewares/userAuth")

router.use(userAuth.verifyToken);

router.get("/", orarendController.getOrarend);
router.get("/:id", orarendController.getOrarend);
router.get("/getTeachers", orarendController.getTeachers);
router.get("/getLessons", orarendController.getLessons);


module.exports = router;