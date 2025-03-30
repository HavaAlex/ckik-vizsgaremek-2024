const absenceRepository = require("../repositories/absenceRepository");

class HianyzasService
{
    async getAbsencesStudent(ID)
    {
        return await absenceRepository.getAbsencesStudent(ID)
    }

    async getStudentsInGroup(groupID)
    {
        return await absenceRepository.getStudentsInGroup(groupID);
    }

    async getAbsences()
    {
        return await absenceRepository.getAbsences();
    }

    async postAbsence(absence)
    {
        return await absenceRepository.createAbsence(absence);
    }
}

module.exports = new HianyzasService();