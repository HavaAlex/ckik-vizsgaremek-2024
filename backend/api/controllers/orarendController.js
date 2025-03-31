const orarendService = require("../services/orarendService")
const csoportService = require("../services/csoportService")
const lessonService = require("../services/lessonService")

exports.getOrarend = async (req, res, next) =>
{
    const weekStart = req.query.weekStart

    const groups = await csoportService.getGroupsOfStudent(req.decoded.role=="szulo"?req.params.id: req.decoded.ID)

    const combinedOrarend = req.decoded.role=="tanar"?await orarendService.getTeacherLessons(req.role.ID,weekStart): await orarendService.getOrarend(groups,weekStart)

    res.status(201).json(combinedOrarend)
}

exports.getTantargyakTanar = async (req, res, next) =>
{
    const tantargyak = await lessonService.getTeacherSubjects(req.role.ID)
    res.status(200).json(tantargyak);
}

exports.getTeachers = async (req, res, next) =>
{
    const teachers = await orarendService.getTeachers()
    res.status(200).json(teachers);
}
exports.getLessons = async (req, res, next) =>
{
    const lessons = await orarendService.getAllLessons()
    res.status(200).json(lessons);
}