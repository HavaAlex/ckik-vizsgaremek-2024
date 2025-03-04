const assignmentRepository = require("../repositories/assignmentRepository")

class hazikService{
    async getGroups(){
        const PotentialGroups = await assignmentRepository.getPotentialGroups()
        return PotentialGroups
    }
    async createAssignment(newHazi,Groups) {
        return await assignmentRepository.createAssignment(newHazi,Groups)
    }
    async uploadAssignmentFiles(files,assignmentId){
        return await assignmentRepository.uploadAssignmentFiles(files,assignmentId)
    }
    async uploadCompletedAssignmentFiles(files,completedAssignmentId){
        return await assignmentRepository.uploadCompletedAssignmentFiles(files,completedAssignmentId)
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
    async getAssignmentFiles(assignmentID){
        return await assignmentRepository.getAssignmentFiles(assignmentID)
    }
    async getCompletedAssignmentFiles(assignmentID){
        return await assignmentRepository.getCompletedAssignmentFiles(assignmentID)
    }
    async deleteAssignment(assignmentID){
        return await assignmentRepository.deleteAssignment(assignmentID)
    }
    async deleteCompletedAssignmentFile(ID){
        return await assignmentRepository.deleteCompletedAssignmentFile(ID)
    }
}
module.exports = new hazikService(); 