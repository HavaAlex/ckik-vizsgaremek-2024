const db = require("../db/dbContext");
const teacher = require("../models/teacher");
const userRepository = require("./userRepository")

class LessonRepository
{
    constructor(db)
    {
        this.Lessons = db.lesson;
        console.log(this.Teachers)
    }

    async createLesson(lesson)
    {
        const newLesson = await this.Lessons.build(lesson);

        await newLesson.save();
        
        return newLesson;
    }

    async getTeacherSubjects(teacherID)
    {
        return await this.Lessons.findAll({
            attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('subjectName')), 'subjectName']],
            where: {
                teacherID: teacherID
            }
        });
    }
}

module.exports = new LessonRepository(db);