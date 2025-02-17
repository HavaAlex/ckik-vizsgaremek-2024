const markRepository = require("../repositories/markRepository");

class JegyService
{
    async getJegyek(ID)
    {
        return await markRepository.getMarksUser(ID);
    }
    async createJegy(mark)
    {
        return await markRepository.createMark(mark);
    }
    async getJegyekCsoport(csoportID)
    {
        return await markRepository.getMarksByGroup(csoportID);
    }
}

module.exports = new JegyService();