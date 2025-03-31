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
        this.Students = db.student;
        this.Absences = db.absence;
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
            return await studentRepository.getStudentByUserID(userID)
        }
        else if (userType == "tanar"){
            return await teacherRepository.getTeacherByUserID(userID)
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

    async createUserName(nev){
        const nameParts = _.deburr(nev.toLowerCase())
                                    .split(" ")
                                    .filter(Boolean);
        const baseUsername = nameParts.join(".");
        let username = baseUsername;
        let counter = 1;
        
        let userExists = await this.Users.findOne({ where: { username: username } });
        while (userExists) {
            counter++;
            username = baseUsername + counter;
            userExists = await this.Users.findOne({ where: { username: username } });
        }
        // console.log("utána ", username)
        return username;
    }
    async generatePassword() { //véletlenszerű jelszó generálás
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_+";
        let password = "";
        for (let i = 0; i < 12; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        return password;
    }

    async getAllUsers() {
        return await this.Users.findAll({
            attributes: ['ID', 'username', 'role']
        });
    }

    async modifyUser(user){
        const changedUser = await this.Users.findOne({ where: { id: user.userSide } });
        await changedUser.update({ username: user.roleSide.name });
        if(user.userRole == "tanar"){
            await teacherRepository.modifyTeacher(user.userSide,user.roleSide)
        }
        else if(user.userRole == "diak"){
            const alreadyexistingUser = await studentRepository.getStudentByOmId(user.roleSide.OMID)
            if(alreadyexistingUser){
                console.log("ez igy mér nem is annyira jó")
                return -1
            }

           await studentRepository.modifyStudent(user.userSide,user.roleSide)
        }
        else if(user.userRole == "szulo"){
            await guardianRepository.modifyGuardian(user.userSide,user.roleSide)
        }
        else if(user.userRole == "admin"){
            await adminRepository.modifyAdmin(user.userSide,user.roleSide)
        }
        return changedUser
    }
    async deleteUser(ID,oaz){
        if(oaz.role == "tanar"){
            await teacherRepository.deleteTeacher(ID)
        }
        else if(oaz.role == "diak"){
           await studentRepository.deleteStudent(ID)
        }
        else if(oaz.role == "szulo"){
            await guardianRepository.deleteGuardian(ID)
        }
        else if(oaz.role == "admin"){
            await adminRepository.deleteAdmin(ID)
        }

        await this.Users.destroy({
            where:{
                ID: ID
            }
        })
        
        return "törölve "
    }

    async deleteAbsence(ID){
        await this.Absences.destroy({
            where:{
                ID: ID
            }
        })
        
        return "törölve "
    }

    async changePassword(ID, userReplacement){
        const record = await this.Users.findOne({
            where: { ID }
        });
        await record.update(userReplacement);
        return record;
    }

    async getAllStudents(){
        return await this.Students.findAll();
    }
}

module.exports = new UserRepository(db);