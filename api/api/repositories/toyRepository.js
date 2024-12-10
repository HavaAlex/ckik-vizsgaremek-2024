const db = require("../db/dbContext");

class toyRepository
{
    constructor(db)
    {
        this.Toy = db.toys;
    }

    async createToy(toy)
    {
        const newToy = await this.Toy.build(toy);

        await newToy.save();

        return newToy;
    }

    async getToy(name)
    {
        return await this.Toy.findOne( 
        {
            where:
            {
                name: name,
            }
        })
    }
    
    async updateToy(name, toy)
    {
        await this.Toy.update(
        { 
            name: toy.name,
            price: toy.price,
            company: toy.company,
            shopID: toy.shopID,
        },
        {
            where:
            {
                name: name,
            }
        })
    }

    async deleteToy(name)
    {
        await this.Toy.destroy(
        {
            where:
            {
                name: name,
            }
        });
    }
}

module.exports = new toyRepository(db);