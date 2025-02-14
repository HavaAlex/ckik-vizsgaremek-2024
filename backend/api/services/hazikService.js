const assignmentRepository = require("../repositories/assignmentRepository")

class hazikService{
    async getGroups(){
        const PotentialGroups = await assignmentRepository.getPotentialGroups()
        return PotentialGroups
    }
}
module.exports = new hazikService();