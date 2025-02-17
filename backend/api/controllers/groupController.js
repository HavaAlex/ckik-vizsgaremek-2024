const groupService = require("../services/groupService");

exports.getTeacherGroups = async (req, res, next) => 
{
    //console.log(req.decoded)
    res.status(200).send(await groupService.getTeacherGroups(req.role.ID));
}