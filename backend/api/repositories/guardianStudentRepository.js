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
    async deleteGurdianStudentByGuardianID(ID){
        await this.GuardianStudent.destroy({
            where: {GuardianID : ID}
        })
        return "Sikeres törlés"
    }
}

module.exports = new GuardianStudentRepository(db);