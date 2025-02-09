const markRepository = require("../repositories/markRepository");

class JegyService
{
    async getJegyek(ID)
    {
        return await markRepository.getMarksUser(ID);
    }
}

module.exports = new JegyService();