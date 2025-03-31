const db = require("../db/dbContext");
const classDisruption = require("../models/classDisruption");
const { Op } = require("sequelize");


class OrarendRepository
{
    constructor(db)
    {
        this.Group = db.group;
        this.StudentGroups = db.studentgroup;
        this.Lesson = db.lesson;
        this.ClassDisruption = db.classdistruption;
        this.Teacher= db.teacher
    }

    async createGroup(orarend)
    {
        const newGroup = await this.Orarendek.build(orarend);

        await newGroup.save();
        
        return newGroup;
    }
    
    async getLessons(groups)//Megkeresi az összes óráját az adott embernek
    {
        groups = groups.map(group => group.GroupID||group.ID);
        return await this.Lesson.findAll
        (
            {
                where: {groupID: groups},
                include:[{
                    model:db.teacher,
                    attributes:["name"]
                }]
            }
        )

    }

    async getTeacherLessons(teacherID)//Megkeresi az összes óráját az adott embernek
    {
        return await this.Lesson.findAll
        (
            {
                where: {teacherID: teacherID},
            }
        )

    }

    async getDisruptions(groups, weekStart) {
        groups = groups.map(group => group.GroupID||group.ID);
        const startOfWeek = new Date(weekStart);
        const endOfWeek = new Date(weekStart);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return await this.ClassDisruption.findAll({
            where: {
                groupID: groups,
                date: {
                    [Op.between]: [startOfWeek, endOfWeek]
                }
            },
            include:[{
                model:db.teacher,
                attributes:["name"]
            }]
        });
    }

    async getTeacherDisruptions(weekStart)
    {

        console.log(weekStart)

        const startOfWeek = new Date(weekStart);
        const endOfWeek = new Date(weekStart);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        
        console.log(startOfWeek)
        

        return await this.ClassDisruption.findAll({
            where: {
                date: {
                    [Op.between]: [startOfWeek, endOfWeek]
                }
            }
        });
    }

    async getTeachers(){
        return await this.Teacher.findAll({ 
            attributes: ['ID','name','phone','email','userId']
        });
    }

    async getAllLessons(){
        return await this.Lesson.findAll({ 
        });
    }
}

module.exports = new OrarendRepository(db);