const db = require("../db/dbContext");
const userRepository = require("./userRepository")

class AbsenceRepository
{
    constructor(db)
    {
        this.Absences = db.absence;
    }

    async createAbsence(absence)
    {
        const newAbsence = await this.Absences.build(absence);

        await newAbsence.save();
        
        return newAbsence;
    }

    async getAbsencesStudent(ID)
    {
        return await this.Absences.findAll
        (
            {
                where:
                {
                    studentID: ID,
                }
            }
        )
    }
}

module.exports = new AbsenceRepository(db);