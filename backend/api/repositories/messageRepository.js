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
        const distinctmessageReceivers = new Set(messageReceivers) // nincs distinct ( hiányzik a c# :( )
        for (const element of distinctmessageReceivers) {
            const newMessageReceiver = {
                MessageID: newMessage.ID,
                UserID: element,
            }
            const newerMessageReceiver = await this.MessageReceiver.build(newMessageReceiver);

            await newerMessageReceiver.save();
            
        }       
        return newMessage;
    }
    async getPotentialReceivers(userID){
        return await this.User.findAll({
            where: {
                ID:{[Op.ne]:userID} //nem a sajátja, magának ne tudjon küldeni üzenetet
            },
        });
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
    async getMessageByID(messageID)// Ákos/Agócs írta, nincs használva 
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
    async getReceivedMessages(userID) //megkeresi egy adott felhasználónak beérkezett üzeneteit. Fontos, hogy nem a messageReceiverst használjuk
{                                     //mert az csak egy kapcsoló tábla és error-t dob. A kapcsolótábla másik felén lévő, User táblára hivatkozunk  
        const messages = await this.Messages.findAll({//helyette
            include: [{
              model: this.User,
              through: { attributes: [] }, // Exclude the connection table fields
              where: { ID: userID }, // Filtering by UserID
              attributes:["ID","username"]
            }]
          });
        return messages;
    }
    async getSenderNames(messageIDs){ // álmos katyvasz, de még jól jöhet.
        const UserNamesWithIDs = [];
        for (const element of messageIDs) {
            const newUserNameWithID={
                ID: element,
                name: await this.User.findOne({
                    where:{
                        ID:element
                    },
                    attributes:[
                        "username"
                    ]
                })
            }
            UserNamesWithIDs.push(newUserNameWithID);
        }
        return(UserNamesWithIDs)
    }


}

module.exports = new MessageRepository(db);