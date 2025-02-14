const jegyService = require("../services/jegyService")
const groupService = require("../services/groupService")
const roleService = require("../services/roleService")

exports.getJegyek = async (req, res, next) =>
{
    console.log("JEGY KEZD")
    const jegyek = await jegyService.getJegyek(req.decoded.ID)
    console.log(jegyek)
    res.status(201).json(jegyek);
    console.log("JEGY VÉG")
}

exports.getJegyekTanar = async (req, res, next) =>
{
    console.log("JEGY KEZD")
    const csoportok = await groupService.getTeacherGroups(req.decoded.ID)
    const jegyek = [];

    console.log(csoportok)
    for (const element of csoportok) {
        const object = {
            groupName: element.name,
            marks: await jegyService.getJegyekCsoport(element.ID)
        };
        jegyek.push(object);
    }

    //console.log("ITTT");
    //console.log(jegyek);

    /*for (const group of jegyek) {
        for (const mark of group.marks) {
            //console.log(mark.studentID)
            //console.log("------------------")
            const studentInfo = await roleService.getRole(mark.studentID,"diak");
            //console.log(studentInfo)
            mark.studentName = studentInfo.name;
        }
    }*/
    res.status(201).json(jegyek);
    console.log("JEGY VÉG")
}

exports.modifyUzenet = async (req, res, next) =>
{
    
}
exports.createUzenet = async (req, res, next) =>
{
    let {ID,senderUserID,message,date} = req.body;

    try
    {
        var newUzenet =
        {
            ID: ID,
            senderUserID: senderUserID,
            message: message,
            date: date,
        }

        newUzenet = await uzenetService.createUzenet(newUzenet);

        res.status(201).json(newUzenet);
    }
    catch(error)
    {
        next(error);
    }
}