const { Op, where } = require("sequelize");
const db = require("../db/dbContext");

class MessageRepository
{
    constructor(db)
    {
        this.Messages = db.message;
        this.User = db.user;
        this.MessageReceiver = db.messagereceiver;
    }

    async createMessage(message, messageReceivers)
    {

        const newMessage = await this.Messages.build(message);

        await newMessage.save();
        console.log("messagefennvan")
        console.log(newMessage)
        
        const distinctmessageReceivers = new Set(messageReceivers)
        console.log("leszűrtcucc")
        console.log(distinctmessageReceivers)
        
        for (const element of distinctmessageReceivers) {
            const newMessageReceiver = {
                MessageID: newMessage.ID,
                UserID: element,
            }
            console.log("uj cucc a kapcsolotablaba")
            console.log(newMessageReceiver)
            const newerMessageReceiver = await this.MessageReceiver.build(newMessageReceiver);

            await newerMessageReceiver.save();
            console.log("sikerult megvan a ")
            console.log(newerMessageReceiver)
            
        }
        /*
        for (let j = 0; j < distinctmessageReceivers.size; j++) {
            const newMessageReceiver = {
                MessageID: newMessage.ID,
                UserID: distinctmessageReceivers[j],
            }
            console.log("uj cucc a kapcsolotablaba")
            console.log(newMessageReceiver)
            const newerMessageReceiver = await this.MessageReceiver.build(newMessageReceiver);

            await newerMessageReceiver.save();
            console.log("sikerult megvan a ")
            console.log(newerMessageReceiver)
        }*/

        
        return newMessage;
    }
/*
    async createMessageReceiver(MessageReceiver){
        const newMessageReceiver = await this.MessageReceiver.build(MessageReceiver)

        await newMessageReceiver.save();

        return newMessageReceiver;
    }*/
    async getPotentialReceivers(userID){
        return await this.User.findAll(/*{
            where: {
                [Op.ne]:{
                    ID:userID
                },
            },
        }*/);
    }
    async getSentMessages(ID)//megkeresi az összes üzenetet egy felhasználótól
    {
        return await this.Messages.findAll
        (
            {
                where:
                {
                    [Op.or]: {
                        senderUserID: ID,
                    },
                },
            }
        )
    }
    async getMessageByID(messageID)//megkeresi az összes üzenetet egy felhasználótól
    {
        return await this.Messages.findAll
        (
            {
                where:
                {
                    ID:messageID
                },
            }
        )
    }
    async getReceivedMessages(userID)
    {
        return await this.Messages.findAll
        (
            {
                include: [
                    {
                        model:db.user,
                        where:{
                            ID:userID
                        }
                    },
                ]
            }
        )
    }


}

module.exports = new MessageRepository(db);