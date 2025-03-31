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
        
        const studentGroups = await this.studentgroup.findAll({
            where: { groupID: groupID },
        });

        const studentIDs = studentGroups.map(sg => sg.StudentID);
        
        if (studentIDs.length === 0) return []; 
        

        const students = await this.Student.findAll({
            where: { id: studentIDs } 
        });

        return students;
    }

    
    async postAbsence(absence)
    {
        const newAbsence = await this.Absences.build(absence);

        await newAbsence.save();
        
        return newAbsence;
    }

    async getAbsences()
    {
        return await this.Absences.findAll();
    }

    async approveAbsence(absenceToBeModified)
    {
        const absence = await this.Absences.findOne({ where: { ID: absenceToBeModified.ID } });
        console.log(absence, "absence");
        await absence.update({ excused: true});
        return absence
    }

    async disapproveAbsence(absenceToBeModified)
    {
        const absence = await this.Absences.findOne({ where: { ID: absenceToBeModified.ID } });
        await absence.update({ excused: false});
        return absence
    }
}

module.exports = new AbsenceRepository(db);