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
    async uploadFiles(files,assignmentId){
        let cucc = await assignmentRepository.uploadFiles(files,assignmentId)
        return cucc
    }
}
module.exports = new hazikService(); 