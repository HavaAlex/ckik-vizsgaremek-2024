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
                    userId: ID,
                }
            }
        )
    }
    async modifyGuardian(ID,guardian){
        // Assume User is a Sequelize model
        console.log("biztos ami biztos: ",ID)
        console.log("szulobe  ", guardian)
        const changedGuardian = await this.Guardians.findOne({ where: { userId: ID } });
        await changedGuardian.update({ name: guardian.name });
        await changedGuardian.update({ email: guardian.email });
        await changedGuardian.update({ phone: guardian.phone });
        return changedGuardian
    }
    async deleteGuardian(ID){
        await this.Guardians.destroy({
            where:{
                userId: ID
            }
        })
    }
}

module.exports = new GuardianRepository(db);