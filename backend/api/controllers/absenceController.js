const absenceService = require("../services/absenceService")

exports.getAbsences = async (req, res, next) =>
{
    const absences = await absenceService.getAbsencesStudent(req.decoded.role=="szulo"?req.params.id:req.decoded.ID)

    res.status(200).json(absences);
}

exports.getStudentsInGroup = async (req, res, next) => {
    const groupID = req.params.groupID;
    const students = await absenceService.getStudentsInGroup(groupID);

    res.status(200).json(students);
}

exports.postAbsence = async (req, res, next) => {


    let { studentID, teacherID, lessonID, date, excused } = req.body;

    date = new Date(date);

    try {
        let absence = {
            ID: undefined,
            studentID: studentID,
            teacherID: teacherID,
            lessonID: lessonID,
            date: date,
            excused: excused || false,
        };

        let absences = await absenceService.getAbsences();

        const plainAbsences = absences.map(a => a.dataValues);

        
        plainAbsences.forEach(absence => {
            console.log("PlainAbsences")
            console.log(absence)
        });

        console.log("New Absence")
        console.log(absence)
        const existingAbsence = await plainAbsences.find(a =>
            a.studentID == studentID &&
            a.lessonID == lessonID &&
            new Date(a.date).getTime() === date.getTime()
        );


        console.log("existingAbsence")
        console.log(existingAbsence)

        if (existingAbsence) {
            throw new Error("Egy olyan diákot akart beirni akit már beirt erre az órára");
        }

        absence = await absenceService.postAbsence(absence);
        res.status(201).json(absence);
    } catch (error) {
        next(error);
    }
};