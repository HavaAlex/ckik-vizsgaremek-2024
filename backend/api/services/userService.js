const user = require("../models/user");
const userRepository  = require("../repositories/userRepository"); 
const teacherRepository = require("../repositories/teacherRepository");
const studentRepository = require("../repositories/studentRepository")
const GuardianStudentRepository = require("../repositories/guardianStudentRepository")
const GuardianRepository = require("../repositories/guardianRepository")
const adminRepository = require("../repositories/adminRepository")
const studentGroupRepository = require("../repositories/studentGroupRepository");
const guardianStudentRepository = require("../repositories/guardianStudentRepository");

class UserService
{
    async createUser(user)
    {
        return await userRepository.createUser(user);
    }

    async getUsers()
    { 
        return await userRepository.getUsers();
    }

    async getUser(username)
    {
        return await userRepository.getUser(username);
    }
    async getUserByID(ID)
    {
        return await userRepository.getUser(ID);
    }

    async getGuardiansChildren(ID)
    {
        return await studentRepository.getGuardiansChildren(ID);
    }
    async getUserWithAdditionalAttributes(ID,role){
        
        if(role == "diak"){
            return await studentRepository.getStudentByUserID(ID)
        }
        else if (role == "tanar"){
            return await teacherRepository.getTeacherByUserID(ID)
        }
        else if (role == "admin"){
            return await adminRepository.getRoleByUserID(ID)
        }
        else if (role == "szulo"){
            return await GuardianRepository.getRoleByUserID(ID)
        }
    }
    async checkIfUsersExist(StudentOMIDs){
        console.log("ezek az OM ID K ", StudentOMIDs)
        for (let i = 0; i < StudentOMIDs.length; i++) {
            const StudentID = await studentRepository.getStudentByOmId(StudentOMIDs[i])
            console.log(StudentID)
            if(StudentID == null){
                console.log("NINCS IJEN SALYNA ")
                return false
            }
            else{
                console.log(" FASZA VAN ILYEN : ",StudentID)
            }
        }
        return true
    }

    async checkIfUsersAlreadyInGroup(StudentOMIDs){
        for (let i = 0; i < StudentOMIDs.length; i++) {
            console.log("Ő A SOROS : ", StudentOMIDs[i])
            const Student = await studentRepository.getStudentByOmId(StudentOMIDs[i])
            console.log("MG IS VAN : ", Student)
            const response = await studentGroupRepository.getStudentGroupByStudentID(Student.ID)

            console.log("EBBE A CSOPORTBA JÁR : ", response)
            if(response != null){
                return true
            }
        }
        return false
    }
}

module.exports = new UserService();