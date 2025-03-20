const messageRepository = require("../repositories/messageRepository")
const messageReceiverRepository = require("../repositories/messageReceiverRepository")

class UzenetService
{
    async getUzenetek(ID) {
        const osszes = {
            elkuldott : [],
            kapott: [], 
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
        overallReceivers.singleUsers = await messageRepository.getPotentialReceivers(ID) // tomb, benne lévő elemek attribute-jai: ID, username, password, role
        overallReceivers.groups = await messageRepository.getPotentialGroups() // tömbb. benne vannak elemek. Azoknak van ID-ja, name-ja és studentList-je
        console.log("GROPSSSS: ", overallReceivers.singleUsers[0])
        return overallReceivers
    }
    async createUzenet(NewUzenet,newMessageReceivers) {

        return await messageRepository.createMessage(NewUzenet,newMessageReceivers)
    }

    async getAllMessages(){
        return await messageRepository.getAllMessages()
    }

    async deleteMessage(ID){
        return await messageRepository.deleteMessage(ID);
    }
}

module.exports = new UzenetService();