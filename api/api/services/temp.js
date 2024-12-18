const toyRepository = require("../repositories/toyRepository");

const shopRepository = require("../repositories/shopRepository");

class PaholyService
{
    async GETfiokInfoTOKEN(token)
    {
        //megkeresi token alapján az usert
    }
    
    async GETfiokInfoID(fiok_id)
    {
        //megkeresi id alapján az usert
    }

    async GETorarendOsztaly(id_object) //{id,csoportE}
    {
        //orarend Osztaly/csoport alapján
    }

    async GETorarendSzemely(fiok_id)
    {
        //orarend Szemely alapján
    }

    async GETuzenet(uzenet_id)
    {
        
        //uzenete id alapján
    }
    
    async createToy(toy)
    {
        if(!toy.name || !toy.price || !toy.company || !toy.shopID)
        {
            const error = new Error("Missing input");
    
            error.status = 400;
    
            throw error;
        }

        if(isNaN(toy.price))
        {
            const error = new Error("Price must be a number");
    
            error.status = 404;
    
            throw error;
        }

        if(!shopRepository.getShop(toy.shopID))
        {
            const error = new Error("Shop not found!");
    
            error.status = 404;
    
            throw error;
        }

        return await toyRepository.createToy(toy);
    }
}

module.exports = new PaholyService();