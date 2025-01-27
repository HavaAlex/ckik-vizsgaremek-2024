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
        this.Teachers = db.teachers;
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

    async getUserRole(user)
    {
        if(user.role == "diak"){
            return await studentRepository.getRoleByUserID(userID)
        }
        else if (user.role == "tanar"){
            return await teacherRepository.getRoleByUserID(userID)
        }
        else if (user.role == "admin"){
            return await adminRepository.getRoleByUserID(userID)
        }
        else if (user.role == "szulo"){
            return await guardianRepository.getRoleByUserID(userID)
        }
    }
}

module.exports = new UserRepository(db);