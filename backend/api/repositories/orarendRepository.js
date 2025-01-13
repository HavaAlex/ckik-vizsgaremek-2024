const db = require("../database/dbContext");

class OrarendRepository
{
    constructor(db)
    {
        this.Orarendek = db.orarendek;
    }

    async createOrarend(orarend)
    {
        const newOrarend = await this.Orarendek.build(orarend);

        await newOrarend.save();
        
        return newOrarend;
    }

    async getOrarend(csoport_id)
    {
        return await this.Orarendek.findOne
        (
            {
                where:
                {
                    csoport_id: csoport_id,
                }
            }
        )
    }
}

module.exports = new OrarendRepository(db);