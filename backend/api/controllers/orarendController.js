const orarendService = require("../services/orarendService")
const csoportService = require("../services/csoportService")
const lessonService = require("../services/lessonService")
const orarendRepository = require("../repositories/orarendRepository")
const lessonRepository = require("../repositories/lessonRepository")

exports.getOrarend = async (req, res, next) =>
{
    const weekStart = req.query.weekStart

    const groups = await csoportService.getGroupsOfStudent(req.decoded.ID)

    const combinedOrarend = req.decoded.role=="tanar"?await orarendService.getTeacherLessons(req.role.ID,weekStart): await orarendService.getOrarend(groups,weekStart)

    res.status(201).json(combinedOrarend)
}


exports.createLessons = async (req, res, next) =>
{
    let lessons = req.body;
    let uploaded = []
    try
    {
        lessons.forEach(async element => {
            const errorMsg = validateLesson(element)
            if(errorMsg!=true)
            {
                res.status(400).json(errorMsg)
                return
            }
        });

        lessons.forEach(async element => {
            var newLesson =
            {
                ID: undefined,
                groupID: element.groupID,
                teacherID: element.teacherID,
                start_Hour:element.start_Hour,
                start_Minute:element.start_Minute,
                length:element.length,
                day:element.day,
                subjectName:element.subjectName
            }
            newLesson = await lessonRepository.createLesson(newLesson);
            updat
        });

        newLesson = await jegyService.createJegy(newJegy);
        uploaded.push(newLesson);
        res.status(201).json(uploaded);
    }
    catch(error)
    {
        next(error)
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
    const lessons = await orarendService.getAllLessons()
    res.status(201).json(lessons);
}