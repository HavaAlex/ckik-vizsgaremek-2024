const { Op, where } = require("sequelize");
const db = require("../db/dbContext");
class AssignmentRepository
{

    constructor(db)
    {
        this.User = db.user;
        this.Group = db.group
        this.Student = db.student
    }


    async getPotentialGroups() {
        const groups = await this.Group.findAll({
            attributes: ['ID', 'name'],
            include: [
                {
                    model: this.Student,
                    attributes: ['userId'],
                    through: { attributes: [] }, // Exclude join table attributes
                }
            ]
        });
    
        const groupList = groups.map(group => ({
            ID: group.ID,
            name: group.name,
            studentList: group.Students.map(student => student.userId)
        }));
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
        console.log(groupList)
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
        return groupList;
}
}

module.exports = new AssignmentRepository(db);