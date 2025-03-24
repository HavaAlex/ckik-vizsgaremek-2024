const db = require("../db/dbContext")

class GuardianStudentRepository
{
    constructor(db)
    {
        this.GuardianStudent = db.guardianstudent;
    }

    async createGuardianStudent(guardianstudent)
    {
        const newGuardianStudent = await this.GuardianStudent.build(guardianstudent);

        await newGuardianStudent.save();
        
        return newGuardianStudent;
    }
}

module.exports = new GuardianStudentRepository(db);