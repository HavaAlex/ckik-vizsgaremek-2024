const toyRepository = require("../repositories/toyRepository");

const shopRepository = require("../repositories/shopRepository");

class JegyService
{
    async GETJegySzemely(fiok_id,tantargy_Id)
    {
        //adott tantágyból visszaküldi a fiok jegyeit
    }
    
    async GETfiokInfoID(fiok_id)
    {
        //megkeresi id alapján az usert
    }
}

module.exports = new JegyService();