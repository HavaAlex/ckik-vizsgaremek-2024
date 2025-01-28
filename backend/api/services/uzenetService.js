const messageRepository = require("../repositories/messageRepository")

class UzenetService
{
    /*
    okjdsfpiojdsfpiokjdsf
    const uzenetService = require("../services/uzenetService")

    const tesztUzenet = {
        ID:undefined,
        senderUserID:1,
        message:"fingo",
        date:"2055"
    }

    uzenetService.createUzenet(tesztUzenet)
    */
    async getUzenetek(ID) {
        return await messageRepository.getMessages(ID)
    }
    async createUzenet(ID) {
        return await messageRepository.createMessage(ID)
    }
}

module.exports = new UzenetService();