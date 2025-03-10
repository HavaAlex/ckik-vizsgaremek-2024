const db = require("../db/dbContext");
const adminRepository = require("./adminRepository")
const studentRepository = require("./studentRepository")
const teacherRepository = require("./teacherRepository")
const guardianRepository = require("./guardianRepository")
const _ = require('lodash');
const user = require("../models/user");

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

        console.log("ez lesz a galiba: ",user)
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
        console.log("iiiii ", username)
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


    async getGuardiansChildren(ID)
    {
        return await this.Students.findAll
        (
            {
                where:
                {
                    guardianID: ID,
                }
            }
        )
    }
    async createUserName(nev){

        console.log("Elötte: ",nev)
        const nameParts = _.deburr(nev.toLowerCase())
                                    .split(" ")
                                    .filter(Boolean);
        const baseUsername = nameParts.join(".");
        let username = baseUsername;
        let counter = 1;
        
        // Check if the username already exists in the database.
        let userExists = await this.Users.findOne({ where: { username: username } });
        while (userExists) {
            counter++;
            username = baseUsername + counter;
            userExists = await this.Users.findOne({ where: { username: username } });
        }
        console.log("utána ", username)
        return username;
    }
    async generatePassword() {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_+";
        let password = "";
        for (let i = 0; i < 12; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        // Example usage:
        return password;
    }
}

module.exports = new UserRepository(db);