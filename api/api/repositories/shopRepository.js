const db = require("../db/dbContext");

const Toy = require("../models/toy").Toy;

class shopRepository
{
    constructor(db)
    {
        this.Toy = db.shops;
    }

    async createShop(toy)
    {
        await this.Toy.create(toy);
    }

    async getShop(shopID)
    {
        return await this.Toy.findOne({ include: Toy }, 
        {
            where:
            {
                ID: shopID,
            }
        })
    }
    
    async updateShop(ID, toy)
    {
        await this.Toy.update(
        { 
            ID: toy.ID, 
            ownerName: toy.ownerName,
        },
        {
            where:
            {
                ID: ID,
            }
        })
    }

    async deleteShop(toy)
    {
        await this.Toy.destroy(
        {
            where:
            {
                ID: toy.ID,
            }
        });
    }
}

module.exports = new shopRepository(db);