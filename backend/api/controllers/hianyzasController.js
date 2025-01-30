const hianyzasService = require("../services/hianyzasService")
const orarendService = require("../services/orarendService")

exports.getHianyzasokDiak = async (req, res, next) =>
{
    console.log("FINGO1")
    console.log(req.decoded)
    const hianyzasok = await hianyzasService.getHianyzasokDiak(req.decoded.ID)

    const groups = await orarendService.getGroup(req.decoded.ID)
    const lessons = await orarendService.getLessons(groups)

    console.log("Csoportok és órák")
    console.log(groups)
    console.log(lessons)

    const hianyzasOrak = []
    hianyzasok.forEach(element => {
        console.log(element.date)
        let erintett = orarendService.getLessonOnDate(lessons,new Date(element.date))
        console.log("erintett")
        console.log(erintett)
        hianyzasOrak.push({ora:erintett,hianyzas:element})
    });
    console.log("FINGO2")
    //console.log(hianyzasok)
    res.status(201).json(hianyzasOrak);
}