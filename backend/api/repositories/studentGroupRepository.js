const db = require("../db/dbContext")

class StudentGroupRepository
{
    constructor(db)
    {
        this.StudentGroups = db.studentgroup;
    }

    async createStudentGroup(studentgroup)
    {
        const newStudentGroup = await this.StudentGroups.build(studentgroup);

        await newStudentGroup.save();
        
        return newStudentGroup;
    }

    async getStudentGroupByStudentID(ID){
        const studentGroup = await this.StudentGroups.findOne({
            where: { StudentID: ID } 
        })
        return studentGroup
    }
    async deleteStudentGroup(ID){
        await this.StudentGroups.destroy({
            where: {StudentID : ID}
        })
        return "Diák eltávolítva a csoportból"
    }
}

module.exports = new StudentGroupRepository(db);