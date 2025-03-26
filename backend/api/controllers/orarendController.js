const orarendService = require("../services/orarendService")
const csoportService = require("../services/csoportService")
const lessonService = require("../services/lessonService")

exports.getOrarend = async (req, res, next) =>
{
    console.log("órarendget")
    console.log("FING")
    console.log(req.decoded)
    const weekStart = req.query.weekStart


    const groups = await csoportService.getGroup(req.decoded.ID)


    const combinedOrarend = req.decoded.role=="tanar"?await orarendService.getTeacherLessons(req.role.ID,weekStart): await orarendService.getOrarend(groups,weekStart)

    console.log(combinedOrarend)
    res.status(201).json(combinedOrarend)
    console.log("órarendgetvég")
}


exports.createOrarend = async (req, res, next) =>
{
    let {oraIDk} = req.body;

    price = Number(price);

    try
    {
        var newToy =
        {
            name: name,
            price: price,
            company: company,
            shopID: shopID,
        }

        newToy = await toyService.createToy(newToy);

        res.status(201).json(newToy);
    }
    catch(error)
    {
        next(error);
    }
}

exports.getTantargyakTanar = async (req, res, next) =>
{
    //console.log("TANTARGY KEZD")
    const tantargyak = await lessonService.getTeacherSubjects(req.role.ID)
    res.status(201).json(tantargyak);
    //console.log("TANTARGY VEG")
}

exports.getTeachers = async (req, res, next) =>
{
    const teachers = await orarendService.getTeachers()
    res.status(201).json(teachers);
}
exports.getLessons = async (req, res, next) =>
{
    const lessons = await orarendService.getLessons()
    res.status(201).json(lessons);
}