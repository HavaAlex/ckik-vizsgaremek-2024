const assignmentRepository = require("../repositories/assignmentRepository")

class hazikService{
    async getGroups(){
        const PotentialGroups = await assignmentRepository.getPotentialGroups()
        return PotentialGroups
    }
    async createAssignment(newHazi,Groups) {
        return await assignmentRepository.createAssignment(newHazi,Groups)
    }
    async uploadFiles(files,assignmentId){
        return await assignmentRepository.uploadFiles(files,assignmentId)
    }
    async getsentAssignments(ID){
        return await assignmentRepository.getsentAssignments(ID)
    }
    async getReceivedAssignments(ID){
        return await assignmentRepository.getReceivedAssignments(ID)
    }
    async getTeacherAssignmentFiles(ID){
        return await assignmentRepository.getTeacherAssignmentFiles(ID)
    }
    async modifycompletedassignment(ID,completedassignment){
        return await assignmentRepository.modifycompletedassignment(ID,completedassignment)
    }
}
module.exports = new hazikService(); 