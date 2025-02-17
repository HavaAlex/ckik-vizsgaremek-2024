const db = require("../db/dbContext");
const adminRepository = require("./adminRepository")
const studentRepository = require("./studentRepository")
const teacherRepository = require("./teacherRepository")
const guardianRepository = require("./guardianRepository")

class UserRepository
{
    constructor(db)
    {
        this.Users = db.user;
        this.Admins = db.admin;
        this.Guardians = db.guardian;
        this.Teachers = db.teacher;
        this.Students = db.student 
        console.log(this.Users)
    }

    async createUser(user)
    {
        const newUser = await this.Users.build(user);

        await newUser.save();
        
        return newUser;
    }

    async getUsers()
    {
        return await this.Users.findAll();
    }

    async getUser(username)
    {
        return await this.Users.findOne
        (
            {
                where:
                {
                    username: username,
                }
            }
        )
    }

    async getUserByID(ID)
    {
        return await this.Users.findOne
        (
            {
                where:
                {
                    ID: ID,
                }
            }
        )
    }

    async getRole(userID,userType)
    {
        if(userType == "diak"){
            return await studentRepository.getRoleByUserID(userID)
        }
        else if (userType == "tanar"){
            return await teacherRepository.getRoleByUserID(userID)
        }
        else if (userType == "admin"){
            return await adminRepository.getRoleByUserID(userID)
        }
        else if (userType == "szulo"){
            return await guardianRepository.getRoleByUserID(userID)
        }
    }

    async getGroupMembers(groupID)
    {
        return await studentRepository.getGroupMembers(groupID)
    }
}

module.exports = new UserRepository(db);