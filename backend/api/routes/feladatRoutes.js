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

// Make sure to protect all routes with your auth middleware
router.use(userAuth.verifyToken);

//Alex dolga (ne piszkáld légyszi)

/**
 * @swagger
 * /feladat/hazikGroups:
 *   get:
 *     tags:
 *       - Hazifeladatok tanár oldal
 *     description: Lekéri a rendszerben lévő összes csoportot
 *     responses:
 *       201:
 *         description: Sikeres csoport lekérés
 *         content:
 *           application/json:
 *             example:
 *                 - ID: 1
 *                   name: "1.b"
 *                   studentList:
 *                       - 1
 *                       - 2
 *                 - ID: 2
 *                   name: "1.a"
 *                   studentList:
 *                       - 3
 *                       - 4
 */
router.get("/hazikGroups", hazikController.getGroups);


/**
 * @swagger
 * /feladat/haziktanar:
 *   get:
 *     tags:
 *       - Hazifeladatok tanár oldal
 *     description: Lekéri a rendszerben lévő összes olyan feladatot amiben a teacher ID megegyezik a req.decoded.id-vel
 *     responses:
 *       201:
 *         description: Sikeres csoport lekérés
 *         content:
 *           application/json:
 *             example:
 *              feladat:
 *                 Assignment:
 *                     dataValues:
 *                       ID: 1
 *                       senderUserID: 3
 *                       desc: "Oldd meg x és y feladatot"
 *                       deadline: "2025-03-29T16:55:00.000Z"
 *                       uploadDate: "2025-03-24T13:54:41.000Z"
 *                       senderUserName: "lajos"
 *              anwsers:
 *                 - CompletedAssignment:
 *                     dataValues:
 *                       ID: 1
 *                       assignmentID: 1
 *                       studentID: 1
 *                       date: "2025-03-25T09:15:34.000Z"
 *                       textAnswer: "Kész van minden"
 *                       status: "Leadva"
 *                       senderUserName: laci
 *                 - CompletedAssignment:
 *                       ID: 2
 *                       assignmentID: 1
 *                       studentID: 2
 *                       date: "2025-03-24T13:54:41.000Z"
 *                       textAnswer: ""
 *                       status: "Nincs leadva"
 *                       senderUserName: "rebeka"
 */
router.get("/haziktanar",tanarHandler.checkRole, hazikController.getsentAssignments);

/**
 * @swagger
 * /feladat/hazikdiak:
 *   get:
 *     tags:
 *       - Hazifeladatok diák oldal
 *     description: Lekéri a rendszerben lévő összes olyan választ amiben a student ID megegyezik a req.decoded.id-vel, majd a válaszok feladatait
 *     responses:
 *       201:
 *         description: Sikeres csoport lekérés
 *         content:
 *           application/json:
 *             example:
 *              valasz:
 *                 CompletedAssignment:
 *                     dataValues:
 *                       ID: 1
 *                       assignmentID: 1
 *                       studentID: 1
 *                       date: "2025-03-25T09:15:34.000Z"
 *                       textAnswer: "Kész van minden"
 *                       status: "Leadva"
 *              feladat:
 *                 Assignment:
 *                     dataValues:
 *                       ID: 1
 *                       teacherID: 1
 *                       desc: "Oldd meg x és y feladatot"
 *                       deadline: "2025-03-29T16:55:00.000Z"
 *                       uploadDate: "2025-03-24T13:54:41.000Z"
 *                       senderUserName: "lajos"
 */
router.get("/hazikdiak",hazikController.getReceivedAssignments)

/**
 * @swagger
 * /feladat/newassignment:
 *   post:
 *     tags:
 *       - Hazifeladatok tanár oldal
 *     description: Új feladat feltölése egy csoport minden tagja számára
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Groups
 *               - Description
 *               - DeadLine
 *               - UploadDate
 *             properties:
 *               Groups:
 *                 type: Array
 *                 description: Az osztály akinek ki lett osztva (azért tömb hogyha meggondoljuk magunkat, hogy több osztálynak is lehessen házit küldeni, ne legyen annyi dolgunk)
 *                 example: [ { ID: 1, name: '1.b', studentList: [ 1, 2 ] } ]
 *               Description:
 *                 type: string
 *                 description: A feladat leírása
 *                 example: "Oldd meg yz feladatot."
 *               DeadLine:
 *                 type: string
 *                 format: date-time
 *                 description: Határidő idő amit frontendről kapunk
 *                 example: "2025-03-30T01:17:00.000Z"
 *               UploadDate:
 *                 type: string
 *                 format: date-time
 *                 description: Feltöltési idő amit frontendről kapunk
 *                 example: "2025-03-27T13:30:38.234Z"
 *     responses:
 *       201:
 *         description: Feladat sikeresen feltöltve
 *         content:
 *           application/json:
 *             example:
 *              Assignment:
 *                dataValues:
 *                  ID: 1
 *                  teacherID: 1
 *                  desc: "Oldd meg yz feladatot."
 *                  deadline: "2025-03-30T01:17:00.000Z"
 *                  uploadDate: "2025-03-27T13:30:38.234Z"
 *       500:
 *         description: Nincs megadva csoport, leírás, határidő vagy a határidő eleve lejárt
 */

router.post("/newassignment",tanarHandler.checkRole,  hazikController.postAssignment);



router.get("/hazikdiak/:id",hazikController.getReceivedAssignments)



/**
 * @swagger
 * /feladat/modifycompletedassignment:
 *   patch:
 *     tags:
 *       - Hazifeladatok diák oldal
 *     description: Kicseréli az régi feltöltésidőt, választ és ha a státusz nincs leadva akkor leadvára cseréli. Minden választ előre kigenerál, a rendszer amikor feltölti az új feladatokat, azután a válaszokat a diákok már csak módosítják ezért lett patch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID
 *               - assignmentID
 *               - date
 *               - status
 *               - studentID
 *               - textAnswer
 *             properties:
 *               ID:
 *                 type: integer
 *                 description: Annak a válasznak az ID-ja amit éppen módosítunk
 *                 example: 1
 *               assignmentID:
 *                 type: integer
 *                 description: A feladat ID-ja. A válasz amit módosítunk ehhez a feladathoz tartozik.
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: A módosítás pillanata
 *                 example: "2025-03-27T13:48:05.317Z"
 *               status:
 *                 type: string
 *                 description: A válasz jelenlegi státusza
 *                 example: "Nincs leadva"
 *               studentID:
 *                 type: integer
 *                 description: A diák ID-ja aki választ ír
 *                 example: 1
 *               textAnswer:
 *                 type: string
 *                 description: A szöveg ami feltöltődik
 *                 example: "A megoldás 9!"
 *     responses:
 *       201:
 *         description: Feladat sikeresen feltöltve
 *         content:
 *           application/json:
 *             example:
 *              CompletedAssignment:
 *                dataValues:
 *                  ID: 1
 *                  studentID: 1
 *                  date: "2025-03-27T13:48:05.317Z"
 *                  textAnswer: "A megoldás 9!"
 *                  status: "Leadva"
 */

router.patch("/modifycompletedassignment",hazikController.modifycompletedassignment)

router.get("/getAssignmentFiles/",hazikController.getAssignmentFiles)
router.post("/getCompletedAssignmentFiles/",hazikController.getCompletedAssignmentFiles)

/**
 * @swagger
 * /feladat/deleteAssignment/{assignmentId}:
 *   delete:
 *     tags: 
 *       - Hazifeladatok tanár oldal
 *     description: Kitöröl egy assignmentet az ID-ja alapján
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Az ID ami alapján kitörli a feladatot
 *     responses:
 *       201:
 *         description: Sikeres törlés
 *         content:
 *           application/json:
 *             example:
 *                sikerült
 */
router.delete("/deleteAssignment/:assignmentId", tanarHandler.checkRole, hazikController.deleteAssignment);

router.delete("/deleteAssignment/:assignmentId",tanarHandler.checkRole, hazikController.deleteAssignment)


router.delete("/deleteAnswerFile/:fileId",hazikController.deleteCompletedAssignmentFile)


/**
 * @swagger
 * /feladat/uploadassignmentfiles:
 *   post:
 *     description: Több fájlt és egy ID-t tölt fel. Ehhez használ a program formData-t amit multerrel olvas be
 *     tags:
 *       - Hazifeladatok tanár oldal
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentId
 *               - files
 *             properties:
 *               assignmentId:
 *                 type: string
 *                 description: Az ID-ja annak az assignmentnek amihez tartozik/tartozni fog a fájl
 *                 example: 1
 *               files:
 *                 type: Array
 *                 description: A fájlok adataik szerint szétbontva
 *                 example: [{ fieldname: 'files', originalname: '1.txt', encoding: '7bit', mimetype: 'text/plain', buffer: <Buffer 31>, size: 1 }]
 *     responses:
 *       200:
 *         description: Fájlok sikeresen feltöltve.
 *         content:
 *            application/json:
 *                example:
 *                    message: 'Files uploaded successfully'
 *                    uploadedFiles:
 *                        - AssignmentFiles:
 *                               dataValues:
 *                                  ID: 1
 *                                  assignmentID: 1
 *                                  buffer: <Buffer 31>
 *                                  mimetype: 'text/plain'
 *                                  filename: '1.txt'
 *                        - AssignmentFiles:
 *                               dataValues:
 *                                  ID: 2
 *                                  assignmentID: 1
 *                                  buffer: <Buffer 33>
 *                                  mimetype: 'text/plain'
 *                                  filename: '2.txt'
 */
router.post(
  "/uploadassignmentfiles",
  upload.array("files"),
  hazikController.uploadAssignmentFiles
);

router.post(
  "/uploadassignmentfiles",
  upload.array("files"),
  hazikController.uploadAssignmentFiles
);

router.post(
  "/uploadcompletedassignmentfiles",
  upload.array("files"),
  hazikController.uploadCompletedAssignmentFiles
)

module.exports = router;
