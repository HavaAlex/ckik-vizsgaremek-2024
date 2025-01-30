const db = require("../db/dbContext");

class OrarendRepository
{
    constructor(db)
    {
        this.Group = db.group;
        this.StudentGroups = db.studentgroup;
        this.Lesson = db.lesson;
    }

    async createGroup(orarend)
    {
        const newGroup = await this.Orarendek.build(orarend);

        await newGroup.save();
        
        return newGroup;
    }

    async getGroup(ID)//Megkeresi az összes csoportját az adott embernek
    {
        return await this.StudentGroups.findAll
        (
            {
                where: {StudentID: ID},
            }
        )
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
}

module.exports = new OrarendRepository(db);