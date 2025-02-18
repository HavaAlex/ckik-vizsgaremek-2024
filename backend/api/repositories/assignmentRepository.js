const { Op, where } = require("sequelize");
const db = require("../db/dbContext");
class AssignmentRepository
{

    constructor(db)
    {
        this.User = db.user;
        this.Group = db.group
        this.Student = db.student
        this.Teacher = db.teacher
        this.Assignment = db.assignment
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
        return groupList;
        }
        async createAssignment(assignmenT, groups)
        {
            let techerID = await this.Teacher.findAll({
                where:{
                    userId:{[Op.eq]:assignmenT.teacherID}
                }
            })
            assignmenT.teacherID = techerID[0].ID
            console.log("AMi bejött: ")
            console.log(assignmenT)
            const newAssignment = await this.Assignment.build(assignmenT);
            await newAssignment.save();
            console.log("az új:")
            console.log(newAssignment)
            return newAssignment;
        }
}

module.exports = new AssignmentRepository(db);