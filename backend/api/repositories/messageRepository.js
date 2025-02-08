const { Op } = require("sequelize");
const db = require("../db/dbContext");

class MessageRepository
{
    constructor(db)
    {
        this.Messages = db.message;
        this.User = db.user
    }

    async createMessage(message)
    {
        const newMessage = await this.Messages.build(message);

        await newMessage.save();
        
        return newMessage;
    }
    async getPotentialReceivers(userID){
        return await this.User.findAll();
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