const db = require("../db/dbContext")

class GuardianStudentRepository
{
    constructor(db)
    {
        this.GuardianStudent = db.guardianstudent;
        console.log(this.Guardians)
    }

    async createGuardianStudent(guardianstudent)
    {
        const newGuardianStudent = await this.GuardianStudent.build(guardianstudent);

        await newGuardianStudent.save();
        
        return newGuardianStudent;
    }

    async getGuardiansChildren(guardianId)
    {
        return this.GuardianStudent.findAll(
            {
                where:{
                    GuardianID: guardianId
                },
                include:{
                    model:db.student,
                    attributes:[]
                }
            }
        )
    }
}

module.exports = new GuardianStudentRepository(db);