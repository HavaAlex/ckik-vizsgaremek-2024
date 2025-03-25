const absenceService = require("../services/absenceService")

exports.getAbsences = async (req, res, next) =>
{
    const absences = await absenceService.getAbsences(req.decoded.ID)

    res.status(201).json(absences);
}

exports.getStudentsInGroup = async (req, res, next) => {
    const groupID = req.params.groupID;
    const students = await absenceService.getStudentsInGroup(groupID);

    res.status(201).json(students);
}

exports.postAbsence = async (req, res, next) =>{
    console.log(req.body)

    let {studentID,teacherID,lessonID,date,excused} = req.body;

    console.log(studentID,teacherID,lessonID,date,excused)

    try
    {
        var absence =
        {
            ID: undefined,
            studentID: studentID,
            teacherID: teacherID,
            lessonID: lessonID,
            date: date,
            excused: false,
        }
        console.log(absence)
        console.log(req.body)
        console.log(req.body.studentID)

        absence = await absenceService.postAbsence(absence);
        console.log("ITT")
        res.status(201).json(absence);
    }

    catch(error)
    {
        next(error);
    }
}