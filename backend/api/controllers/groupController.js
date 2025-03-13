const groupService = require("../services/csoportService");
const roleService = require("../services/roleService")

exports.getTeacherGroups = async (req, res, next) => 
{
    //console.log(req.decoded)
    res.status(200).send(await groupService.getTeacherGroups(req.role.ID));
}

exports.getTeacherGroupMembers = async (req, res, next) => 
{
    //console.log("CSOPORT")
    //console.log(req.role.ID)
    const groups = await groupService.getTeacherGroups(req.role.ID);
    //console.log(groups)
    //console.log("CSOPORT VÉG")
    const members = []
    for(const element of groups){
        //console.log(groups)
        //console.log("CSOPORTELEM KEZD")
        //console.log(element)
        //console.log(element.ID)
        //console.log("CSOPORTELEM VÉG")
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