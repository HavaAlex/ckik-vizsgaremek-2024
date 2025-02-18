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
        return osszes
    }
    async getPotentialReceivers(ID){ //kiszedi az összes elérhető felhasználót ( ez jelenleg mindenki, később változhat)
        
         
        const overallReceivers = {
            singleUsers : [],
            groups : []
        }
        overallReceivers.singleUsers = await messageRepository.getPotentialReceivers(ID)
        overallReceivers.groups = await messageRepository.getPotentialGroups()
        return overallReceivers
    }
    async createUzenet(NewUzenet,newMessageReceivers) {

        return await messageRepository.createMessage(NewUzenet,newMessageReceivers)
    }
}

module.exports = new UzenetService();