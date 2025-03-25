const orarendService = require("../services/orarendService")
const csoportService = require("../services/csoportService")
const lessonService = require("../services/lessonService")

exports.getOrarend = async (req, res, next) =>
{
    console.log("órarendget")
    console.log("FING")
    console.log(req.decoded)
    const groups = await csoportService.getGroup(req.role.ID)
    console.log(groups)
    const combinedOrarend = req.decoded.role=="tanar"?await orarendService.getTeacherLessons(req.role.ID): await orarendService.getOrarend(groups)

    console.log(combinedOrarend)
    res.status(201).json(combinedOrarend)
    console.log("órarendgetvég")
}

exports.modifyOrarend = async (req, res, next) =>
{
    
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