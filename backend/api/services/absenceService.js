const absenceRepository = require("../repositories/absenceRepository");

class HianyzasService
{
    async getAbsences(ID)
    {
        return await absenceRepository.getAbsencesStudent(ID)
    }
}

module.exports = new HianyzasService();