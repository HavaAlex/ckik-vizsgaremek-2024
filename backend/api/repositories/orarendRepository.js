const db = require("../db/dbContext");
const classDisruption = require("../models/classDisruption");

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

    async getDisruptions(groups)//Megkeresi az összes óráját az adott embernek
    {
        groups = groups.map(group => group.GroupID);
        console.log(groups);
        console.log(classDisruption);
        return await this.ClassDisruption.findAll
        (
            {
                where: {groupID: groups},
            }
        )
    }

    async getDisruptionsForCurrentWeek() {
        const today = moment();
        const startOfWeek = today.startOf('week').toDate();
        const endOfWeek = today.endOf('week').toDate();

        return await ClassDisruption.findAll({
            where: {
                date: {
                    [Op.between]: [startOfWeek, endOfWeek]
                }
            }
        });
    }
}

module.exports = new OrarendRepository(db);