const { IGNORE } = require("sequelize/lib/index-hints");
const db = require("../db/dbContext");
const userRepository = require("./userRepository")

class DisruptionRepository
{
    constructor(db)
    {
        this.Disruptions = db.classdistruption;
    }

    async createDisruption(disruption)
    {
        const newDisruption = await this.Disruptions.build(disruption);

        await newDisruption.save();
        
        return newDisruption;
    }
}

module.exports = new DisruptionRepository(db);