const absenceRepository = require("../repositories/absenceRepository");

class HianyzasService
{
    async getHianyzasokDiak(ID)
    {
        return await absenceRepository.getAbsencesStudent(ID)
    }
}

module.exports = new HianyzasService();