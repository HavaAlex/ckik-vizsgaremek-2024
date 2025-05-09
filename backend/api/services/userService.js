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
    async checkIfUsersExist(StudentOMIDs){ // megnézi, hogy van e az adott OM azonosóval diák

        for (let i = 0; i < StudentOMIDs.length; i++) {
            const StudentID = await studentRepository.getStudentByOmId(StudentOMIDs[i])
            if(StudentID == null){

                return false
            }
        }
        return true
    }

    async checkIfUsersAlreadyInGroup(StudentOMIDs){
        for (let i = 0; i < StudentOMIDs.length; i++) {
            const Student = await studentRepository.getStudentByOmId(StudentOMIDs[i])
            const response = await studentGroupRepository.getStudentGroupByStudentID(Student.ID)
            if(response != null){
                return true
            }
        }
        return false
    }
}

module.exports = new UserService();