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
    async getPotentialReceivers(ID){
        const PotentialReceiversArray = await messageRepository.getPotentialReceivers(ID)
        return PotentialReceiversArray
    }
    async createUzenet(NewUzenet,newMessageReceivers) {
        console.log("NewUzenet:")
        console.log(NewUzenet.date)
        console.log(NewUzenet.message)
        console.log("newMessageReceivers: ")
        console.log(newMessageReceivers)
        return await messageRepository.createMessage(NewUzenet,newMessageReceivers)
    }/*
    async createMessageReceiver(newMessageReceiver){
        return await messageRepository.createMessageReceiver(newMessageReceiver)
    }*/
}

module.exports = new UzenetService();