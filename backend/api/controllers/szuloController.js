const orarendService = require("../services/orarendService")
const csoportService = require("../services/csoportService")
const lessonService = require("../services/lessonService")
const roleService = require("../services/roleService")

exports.getOrarend = async (req, res, next) =>
{
    console.log("SZÜLÖórarendget")
    console.log("FING")
    console.log(req.decoded)
    const groups = await csoportService.getGroup(req.child.ID)
    const combinedOrarend = await orarendService.getOrarend(groups)

    console.log(combinedOrarend)
    res.status(201).json(combinedOrarend)
    console.log("SZÜLÖórarendgetvég")
}