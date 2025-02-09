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
}

module.exports = new StudentGroupRepository(db);