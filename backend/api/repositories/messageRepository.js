const db = require("../db/dbContext");

class MessageRepository
{
    constructor(db)
    {
        this.Messages = db.message;
    }

    async createMessage(message)
    {
        const newMessage = await this.Messages.build(message);

        await newMessage.save();
        
        return newMessage;
    }

    async getMessages(ID)//megkeresi az összes üzenetet egy felhasználótól
    {
        return await this.Messages.findAll
        (
            {
                where:
                {
                    senderUserID: ID,
                }
            }
        )
    }
}

module.exports = new MessageRepository(db);