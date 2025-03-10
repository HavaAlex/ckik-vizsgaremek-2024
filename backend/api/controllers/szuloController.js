const userService = require("../services/userService");

const groupService = require("../services/groupService");

const roleService = require("../services/roleService");

const orarendService = require("../controllers/orarendController")
const jegyService = require("../controllers/orarendController")
const 

exports.getSzuloOrarend = async (req, res, next) =>
{
    console.log("SZULO KÉRELEM")
    const { gyerekID } = req.body;

    if(gyerekID == undefined)
    {
        res.status(400).send("Nincs megadva a lekérdendő gyerek!");
        return
    }
    
}

exports.getSzuloJegyek = async (req, res, next) => 
{
    const { gyerekID } = req.body;

    if(gyerekID == undefined)
    {
        res.status(400).send("Nincs megadva a lekérdendő gyerek!");
        return
    }
}

exports.getSzuloHianyzasok = async (req, res, next) => 
{
    const { gyerekID } = req.body;

    if(gyerekID == undefined)
    {
        res.status(400).send("Nincs megadva a lekérdendő gyerek!");
        return
    }
}

exports.getSzuloFeladatok = async (req, res, next) => 
{
    const { gyerekID } = req.body;

    if(gyerekID == undefined)
    {
        res.status(400).send("Nincs megadva a lekérdendő gyerek!");
        return
    }
}