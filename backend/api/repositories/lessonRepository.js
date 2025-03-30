const db = require("../db/dbContext");
const teacher = require("../models/teacher");
const userRepository = require("./userRepository")

class LessonRepository
{
    constructor(db)
    {
        this.Lessons = db.lesson;
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

    async getLessonByID(lessonID)//Megkeresi az összes csoportját az adott embernek
    {
        return await db.lesson.findOne
        (
            {
                where: {ID: Number(lessonID)},
            }
        )
    }

    async modifyLesson(lesson){
        const changedLesson = await this.Lessons.findOne({ where: { ID: lesson.ID } });
        await changedLesson.update({ groupID: lesson.groupID });
        await changedLesson.update({ teacherID: lesson.teacherID });
        await changedLesson.update({ start_Hour: lesson.start_Hour });
        await changedLesson.update({ start_Minute: lesson.start_Minute+lesson.start_Hour*60 });
        await changedLesson.update({ length: lesson.length });
        await changedLesson.update({ day: lesson.day });
        await changedLesson.update({ subjectName: lesson.subjectName });
        return changedLesson
    }

    async deleteLesson(ID){
        await this.Lessons.destroy({
            where: {ID : ID}
        })
        return "Óra eltávolítva"
    }
}

module.exports = new LessonRepository(db);