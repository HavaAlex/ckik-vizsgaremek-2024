const db = require("../db/dbContext");
const user = require("../models/user");
const userRepository = require("./userRepository")
const _ = require('lodash');
const bcrypt = require("bcrypt");
const salt = 10;

class AdminRepository
{
    constructor(db)
    {
        this.Admins = db.admin;
        this.User = db.user
        this.Teachers = db.teacher;
        this.Students = db.student
        this.Guardian = db.guardian;
        console.log(this.Admins)
    }

    async createAdmin(admin)
    {
        const newAdmin = await this.Admins.build(admin);

        await newAdmin.save();
        
        return newAdmin;
    }

    async getRoleByUserID(ID)
    {
        return await this.Admins.findOne
        (
            {
                where:
                {
                    userID: ID,
                }
            }
        )
    }

    

    async uploadTeachers(teachers, passwordsUncrypted) {
        
        const userek = [];
        console.log("jenysavak: ",passwordsUncrypted)
        let i = 0;
        for (const teacher of teachers) {
            // Use lodash.deburr to remove diacritics
            const nameParts = _.deburr(teacher.name.toLowerCase())
                .split(" ")
                .filter(Boolean);
            const baseUsername = nameParts.join(".");
            let username = baseUsername;
            let counter = 1;
            
            // Check if the username already exists in the database.
            let userExists = await this.User.findOne({ where: { username: username } });
            while (userExists) {
                counter++;
                username = baseUsername + counter;
                userExists = await this.User.findOne({ where: { username: username } });
            }
            const passwordUncrypted = passwordsUncrypted[i]
            // Create new user object with the given attributes.
            const newUser = {
                id: null,
                username: username,
                password: await bcrypt.hash(passwordUncrypted, salt),
                role: "tanar"
            };
            
            const createdUser = await this.User.build(newUser);
            await createdUser.save();

            newUser.password = passwordUncrypted
            userek.push(createdUser);
            i++;
        }
        
        return userek;
    }

    
}

module.exports = new AdminRepository(db);