const toyRepository = require("../repositories/toyRepository");

const shopRepository = require("../repositories/shopRepository");

class HianyzasService
{
    async GEThianyzasSzemely(fiok_id)
    {
        //vissza küldi egy diak hiányzásait
    }
    
    async GEThianyzasOra(ora_id)
    {
        //vissza küldi egy órán lévő diákok jelenlétét
    }
    async INSERThianyzas(fiok_id,ora_id)
    {
        //ora_id órán fiok_id-vel rendelkező embert hiányzónak jelentbe
    }
    async DELETEhianyzas(fiok_id,ora_id)
    {
        //ora_id órán fiok_id-vel rendelkező ember hiányzását törli
    }
}

module.exports = new HianyzasService();