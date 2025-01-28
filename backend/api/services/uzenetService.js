const messageRepository = require("../repositories/messageRepository")

class UzenetService
{
    async getUzenetek(ID) {
        return await messageRepository.getMessages(ID)
    }
}

module.exports = new UzenetService();