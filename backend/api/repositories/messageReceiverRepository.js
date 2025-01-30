const db = require("../db/dbContext")

class MessageReceiverRepository
{
    constructor(db)
    {
        this.MessageReceiver = db.messagereceiver;
    }

    async createMessageReciever(messagereceiver)
    {
        const newMessageReceiver = await this.MessageReceiver.build(messagereceiver);

        await newMessageReceiver.save();
        
        return newMessageReceiver;
    }

    async getMessageReceiver(ID)
    {
        return await this.MessageReceiver.findAll
        (
            {
                where:
                {
                    ID: ID,
                }
            }
        )
    }
}

module.exports = new MessageReceiverRepository(db);