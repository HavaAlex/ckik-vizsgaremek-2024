const db = require("../db/dbContext");

class OrarendRepository
{
    constructor(db)
    {
        this.Group = db.group;
    }

    async createGroup(orarend)
    {
        const newGroup = await this.Orarendek.build(orarend);

        await newGroup.save();
        
        return newGroup;
    }

    async getGroup(ID)//megkeresi az összes üzenetet egy felhasználótól
    {
        return await this.Group.findAll
        (
            {
                where:
                {
                    ID: ID,
                }
            }
        )
    }
}

module.exports = new OrarendRepository(db);