const db = require("../db/dbContext");
const classDisruption = require("../models/classDisruption");
const { Op } = require('sequelize');

class OrarendRepository
{
    constructor(db)
    {
        this.Group = db.group;
        this.StudentGroups = db.studentgroup;
        this.Lesson = db.lesson;
        this.ClassDisruption = db.classdistruption;
    }

    async createGroup(orarend)
    {
        const newGroup = await this.Orarendek.build(orarend);

        await newGroup.save();
        
        return newGroup;
    }
    
    async getLessons(groups)//Megkeresi az összes óráját az adott embernek
    {
        groups = groups.map(group => group.GroupID);
        console.log(groups);
        return await this.Lesson.findAll
        (
            {
                where: {groupID: groups},
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
        // Map groups to an array of IDs
        groups = groups.map(group => group.GroupID);
        console.log(groups);
        console.log(classDisruption);
    
        // Create a date for the end of the week (weekStart is assumed to be a Monday)
        const startOfWeek = new Date(weekStart);
        const endOfWeek = new Date(weekStart);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
    
        // Query disruptions that are within the current week
        return await this.ClassDisruption.findAll({
            where: {
                groupID: groups,
                date: {
                    [Op.between]: [startOfWeek, endOfWeek]
                }
            }
        });
    }

    async getTeacherDisruptions(teacherID,weekStart)//Megkeresi az összes óráját az adott embernek
    {
        // Create a date for the end of the week (weekStart is assumed to be a Monday)
    
        // Create a date for the end of the week (weekStart is assumed to be a Monday)
        const startOfWeek = new Date(weekStart);
        const endOfWeek = new Date(weekStart);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
    
        // Query disruptions that are within the current week
        return await this.ClassDisruption.findAll({
            where: {
                date: {
                    [Op.between]: [startOfWeek, endOfWeek]
                }
            }
        });
    }


}

module.exports = new OrarendRepository(db);