const { IGNORE } = require("sequelize/lib/index-hints");
const db = require("../db/dbContext");
const userRepository = require("./userRepository")

class AbsenceRepository
{
    constructor(db)
    {
        this.Absences = db.absence;
        this.Student = db.student;
        this.studentgroup = db.studentgroup;
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
    async getStudentsInGroup(groupID) {
        // igen, ez jó szar, de ha szebben akarom akkor nem működik :D (nem tudom miért)

        const studentGroups = await this.studentgroup.findAll({
            where: { groupID: groupID },
            attributes: ['StudentID'],
            raw: true
        });
    

        const studentIDs = studentGroups.map(sg => sg.StudentID);
    
        if (studentIDs.length === 0) return []; 
    

        return await this.Student.findAll({
            where: { id: studentIDs } 
        });
    }
}

module.exports = new AbsenceRepository(db);