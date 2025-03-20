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

    
    async getGroup(studentID)//Megkeresi az összes csoportját az adott embernek
    {
        return await db.studentgroup.findAll
        (
            {
                where: {StudentID: studentID},
            }
        )
    }

    async getAllGroups()
    {
        return await db.group.findAll({})
    }

    async deleteGroup(ID){
        await this.Groups.destroy({
            where: {ID : ID}
        })
        return "Diák eltávolítva a csoportból"
    }


      
}

module.exports = new GroupRepository(db);