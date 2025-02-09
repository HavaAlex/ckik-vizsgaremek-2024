const messageRepository = require("../repositories/messageRepository")
const messageReceiverRepository = require("../repositories/messageReceiverRepository")

class UzenetService
{
    async getUzenetek(ID) {
        const osszes = {
            elkuldott : [],
            kapott: [], 
            senderUserNames:[] //jelenleg használaton kívül van
        }
        osszes.elkuldott = await messageRepository.getSentMessages(ID)
        osszes.kapott = await messageRepository.getReceivedMessages(ID)
        const senderIDs = new Set();
        for (let ik = 0; ik < osszes.kapott.length; ik++) { //ez egy katyvasz, este volt és nem tudtam mi a helyzet
            senderIDs.add(osszes.kapott[ik].ID)
        }
        osszes.senderUserNames  = await messageRepository.getSenderNames(senderIDs)
        return osszes
    }
    async getPotentialReceivers(ID){ //kiszedi az összes elérhető felhasználót ( ez jelenleg mindenki, később változhat)
        const PotentialReceiversArray = await messageRepository.getPotentialReceivers(ID)
        return PotentialReceiversArray
    }
    async createUzenet(NewUzenet,newMessageReceivers) {
        return await messageRepository.createMessage(NewUzenet,newMessageReceivers)
    }
}

module.exports = new UzenetService();