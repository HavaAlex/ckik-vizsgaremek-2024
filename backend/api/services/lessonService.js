const LessonRepository = require("../repositories/lessonRepository");

class LessonService
{
    async getTeacherSubjects(teacherID)
    {
        return await LessonRepository.getTeacherSubjects(teacherID);
    }
}

module.exports = new LessonService();