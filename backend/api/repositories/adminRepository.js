const db = require("../db/dbContext");
const userRepository = require("./userRepository")

class AdminRepository
{
    constructor(db)
    {
        this.Admins = db.admin;
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
}

module.exports = new AdminRepository(db);