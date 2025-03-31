const express = require("express");

const router = express.Router();


const userAuth = require("../middlewares/userAuth");

const uzenetController = require("../controllers/uzenetController");


router.use(userAuth.verifyToken);


/**
 * @swagger
 * /uzenet:
 *   get:
 *     tags:
 *       - Uzenetek
 *     description: Lekéri az üzeneteket az éppen bejelentkezett felhasználó ID-ja alapján
 *     responses:
 *       201:
 *         description: Sikeres üzenet lekérés
 *         content:
 *           application/json:
 *             example:
 *              elkuldott:
 *                 - Message:
 *                     dataValues:
 *                       ID: 1
 *                       senderUserID: 3
 *                       message: "Példa üzenet"
 *                       date: "2025-03-24T16:54:41.000Z"
 *                       receivers:
 *                         - User:
 *                             dataValues: { ID: 1, username: "laci" }
 *                         - User:
 *                             dataValues: { ID: 2, username: "rebeka" }
 *                       sender:
 *                         User:
 *                           dataValues: { ID: 3, username: "lajos" }
 *                 - Message:
 *                     dataValues:
 *                       ID: 1
 *                       senderUserID: 3
 *                       message: "Példa üzenet2"
 *                       date: "2025-03-26T16:54:41.000Z"
 *                       receivers:
 *                         - User:
 *                             dataValues: { ID: 1, username: "laci" }
 *                         - User:
 *                             dataValues: { ID: 2, username: "rebeka" }
 *                       sender:
 *                         User:
 *                           dataValues: { ID: 3, username: "lajos" }
 *              kapott:
 *                 - Message:
 *                     dataValues:
 *                       ID: 1
 *                       senderUserID: 1
 *                       message: "Példa üzenet 3"
 *                       date: "2025-03-24T16:54:41.000Z"
 *                       receivers:
 *                         - User:
 *                             dataValues: { ID: 3, username: "lajos" }
 *                         - User:
 *                             dataValues: { ID: 2, username: "rebeka" }
 *                       sender:
 *                         User:
 *                           dataValues: { ID: 1, username: "laci" }
 *                 - Message:
 *                     dataValues:
 *                       ID: 1
 *                       senderUserID: 1
 *                       message: "Példa üzenet 4"
 *                       date: "2025-03-26T16:54:41.000Z"
 *                       receivers:
 *                         - User:
 *                             dataValues: { ID: 3, username: "lajos" }
 *                         - User:
 *                             dataValues: { ID: 2, username: "rebeka" }
 *                       sender:
 *                         User:
 *                           dataValues: { ID: 1, username: "laci" }
 *                
 */


router.get("/", uzenetController.getUzenetek);


/**
 * @swagger
 * /uzenet/uzenetekreceivers:
 *   get:
 *     tags:
 *       - Uzenetek
 *     description: Lekéri az összes felhasználót illetve csoportot
 *     responses:
 *       201:
 *         description: Visszaküldött objektum benne, külön külön egyéni felhasználók és csoportok
 *         content:
 *           application/json:
 *             example:
 *              singleUsers:
 *                 - User:
 *                     dataValues:
 *                       ID: 1
 *                       username: 'laci'
 *                       role: 'diak'
 *                 - User:
 *                     dataValues:
 *                       ID: 2
 *                       username: 'rebeka'
 *                       role: 'diak'
 *              groups:
 *                 - ID: 1
 *                   name: '1.b'
 *                   studentList: 
 *                    - 1
 *                    - 2
 */


router.get("/uzenetekreceivers", uzenetController.getPotentialReceivers);

/**
 * @swagger
 * /uzenet:
 *   post:
 *     tags:
 *       - Uzenetek
 *     description: Új üzenet létrehozása a bejelentkezett felhasználó által
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - date
 *               - receiverlist
 *               - receiverGrouplist
 *             properties:
 *               message:
 *                 type: string
 *                 description: Az üzenet szövege
 *                 example: "Mi a hézag hapsikám?"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Az üzenet küldésének időpontja
 *                 example: "2025-03-24T16:54:41.000Z"
 *               receiverlist:
 *                 type: array
 *                 description: A címzettek listája
 *                 items:
 *                   type: object
 *                   properties:
 *                     ID:
 *                       type: integer
 *                       example: 4
 *                     username:
 *                       type: string
 *                       example: 'jozsi'
 *                     role:
 *                        type: string
 *                        example: 'szulo'
 *               receiverGrouplist:
 *                 type: array
 *                 description: A címzettek csoportlistája, amely diáklistákat tartalmaz
 *                 items:
 *                   type: object
 *                   properties:
 *                     ID:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: '1.b'
 *                     studentList:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1,2]
 *     responses:
 *       201:
 *         description: Üzenet sikeresen létrehozva
 *         content:
 *           application/json:
 *             example:
 *               ID: 10
 *               senderUserID: 1
 *               message: "Mi a hézag hapsikám?"
 *               date: "2025-03-24T16:54:41.000Z"
 *       400:
 *         description: Nem sikerült létrehozni az üzenetet
 *       500:
 *         description: Hiba történt (hiányzó üzenet vagy címzettlista)
 */


router.post("/", uzenetController.createUzenet); 


module.exports = router;
