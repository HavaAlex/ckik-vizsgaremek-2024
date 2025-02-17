const db = require("../db/dbContext");

class GuardianRepository
{
    constructor(db)
    {
        this.Guardians = db.guardian;
        console.log(this.Guardians)
    }

    async createGuardian(guardian)
    {
        const newGuardian = await this.Guardians.build(guardian);

        await newGuardian.save();
        
        return newGuardian;
    }

    async getRoleByUserID(ID)
    {
        return await this.Guardians.findOne
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

module.exports = new GuardianRepository(db);