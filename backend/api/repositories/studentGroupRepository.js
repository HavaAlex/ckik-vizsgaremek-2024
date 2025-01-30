const db = require("../db/dbContext")

class StudentGroupRepository
{
    constructor(db)
    {
        this.StudentGroup = db.studentgroup;
    }

    async createStudentGroup(studentgroup)
    {
        const newStudentGroup = await this.StudentGroup.build(studentgroup);

        await newStudentGroup.save();
        
        return newStudentGroup;
    }
}

module.exports = new StudentGroupRepository(db);