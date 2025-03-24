const absenceRepository = require("../repositories/absenceRepository");

class HianyzasService
{
    async getAbsences(ID)
    {
        return await absenceRepository.getAbsencesStudent(ID)
    }

    async getStudentsInGroup(groupID)
    {
        return await absenceRepository.getStudentsInGroup(groupID);
    }
}

module.exports = new HianyzasService();