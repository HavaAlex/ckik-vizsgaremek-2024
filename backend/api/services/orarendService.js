const orarendRepository  = require("../repositories/orarendRepository");

class OrarendService
{
    async createGroup()
    {
        return await orarendRepository.createGroup();
    }

    async getGroup(ID) {
        return await orarendRepository.getGroup(ID)
    }


    async createOra()
    {

    }
    
    async createOrarend()
    {

    }
    async getOra()
    {

    }
    async getOrarend()
    {

    }
}

module.exports = new OrarendService();