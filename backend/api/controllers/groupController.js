const groupService = require("../services/csoportService");
const roleService = require("../services/roleService")

exports.getTeacherGroups = async (req, res, next) => 
{
    res.status(200).send(await groupService.getTeacherGroups(req.role.ID));
}

exports.getTeacherGroupMembers = async (req, res, next) => 
{
    const groups = await groupService.getTeacherGroups(req.role.ID);
    const members = []
    for(const element of groups){
        members.push({groupName:element.name,members: await roleService.getGroupMembers(element.ID)})
    }
    res.status(200).send(members);
}

exports.createGroup = async (req, res, next) =>
{
    let {ID, name} = req.body;

    try
    {
        var newGroup =
        {
            ID: ID,
            name: name,
        }

        newGroup = await orarendService.createGroup(newGroup);

        res.status(201).json(newGroup);
    }
    catch(error)
    {
        next(error);
    }
}