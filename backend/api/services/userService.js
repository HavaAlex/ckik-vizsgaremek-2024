const user = require("../models/user");
const userRepository  = require("../repositories/userRepository"); 
const teacherRepository = require("../repositories/teacherRepository");
const studentRepository = require("../repositories/studentRepository")
const GuardianStudentRepository = require("../repositories/guardianStudentRepository")
const GuardianRepository = require("../repositories/guardianRepository")
const adminRepository = require("../repositories/adminRepository")

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
        return await userRepository.getGuardiansChildren(ID);
    }
    async getUserWithAdditionalAttributes(ID,role){
        
        if(role == "diak"){
            return await studentRepository.getRoleByUserID(ID)
        }
        else if (role == "tanar"){
            return await teacherRepository.getRoleByUserID(ID)
        }
        else if (role == "admin"){
            return await adminRepository.getRoleByUserID(ID)
        }
        else if (role == "szulo"){
            return await GuardianRepository.getRoleByUserID(ID)
        }
    }
    
}

module.exports = new UserService();