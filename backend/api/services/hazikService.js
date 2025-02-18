const assignmentRepository = require("../repositories/assignmentRepository")

class hazikService{
    async getGroups(){
        const PotentialGroups = await assignmentRepository.getPotentialGroups()
        return PotentialGroups
    }
    async createAssignment(newHazi,Groups) {

        let kiscucc =  await assignmentRepository.createAssignment(newHazi,Groups)
        console.log("SERVISZ BE VOK MÁ:  ")
        console.log(kiscucc)
        return(kiscucc)
    }
}
module.exports = new hazikService(); 