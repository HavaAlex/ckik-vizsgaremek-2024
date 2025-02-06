const messageRepository = require("../repositories/messageRepository")
const messageReceiverRepository = require("../repositories/messageReceiverRepository")

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
        const elkuldott = await messageRepository.getSentMessages(ID)
        const kapott = await messageRepository.getReceivedMessages(ID)
        return elkuldott.concat(kapott)
    }
    async createUzenet(ID) {
        return await messageRepository.createMessage(ID)
    }
}

module.exports = new UzenetService();