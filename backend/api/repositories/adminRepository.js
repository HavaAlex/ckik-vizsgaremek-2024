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
                    userId: ID,
                }
            }
        )
    }
    
    async modifyAdmin(ID,admin){
        const changedAdmin = await this.Admins.findOne({ where: { userId: ID } });
        await changedAdmin.update({ name: admin.name });
        await changedAdmin.update({ email: admin.email });
        await changedAdmin.update({ phone: admin.phone });
        return changedAdmin
    }
    async deleteAdmin(ID){
        await this.Admins.destroy({
            where:{
                userId: ID
            }
        })
    }
}

module.exports = new AdminRepository(db);