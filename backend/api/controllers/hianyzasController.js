const hianyzasService = require("../services/hianyzasService")
const orarendService = require("../services/hianyzasService")

exports.getHianyzasokDiak = async (req, res, next) =>
{
    console.log("FINGO1")
    console.log(req.decoded)
    const hianyzasok = await hianyzasService.getHianyzasokDiak(req.decoded.ID)
    const hianyzasOrak = []
    hianyzasok.forEach(element => {
        let erintett = orarendService.getLessonOnDate(lessons,element.date)
        hianyzasOrak.push({ora:erintett,hianyzas:element})
    });
    console.log("FINGO2")
    console.log(hianyzasok)
    res.status(201).json(hianyzasOrak);
}