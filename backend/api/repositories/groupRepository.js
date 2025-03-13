const db = require("../db/dbContext");

class GroupRepository
{
    constructor(db)
    {
        this.Groups = db.group;
    }

    async createGroup(group)
    {
        const newGroup = await this.Groups.build(group);

        await newGroup.save();
        
        return newGroup;
    }
    async getTeacherGroups(teacherID){
        return await this.Groups.findAll
        (
            {
                distinct:true,
                include: [{
                    model: db.lesson,
                    where: { teacherID: teacherID },
                }]
            }
        )
    }
    
}

module.exports = new GroupRepository(db);