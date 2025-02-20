const { Op, where } = require("sequelize");
const db = require("../db/dbContext");

class MessageRepository
{
    constructor(db)
    {
        this.Messages = db.message;
        this.User = db.user;
        this.MessageReceiver = db.messagereceiver;
        this.Group = db.group
        this.Student = db.student
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

    async getPotentialGroups() {
        const groups = await this.Group.findAll({
            attributes: ['ID', 'name'],
            include: [
                {
                    model: this.Student,
                    attributes: ['userId'],
                    through: { attributes: [] }, // Exclude join table attributes
                }
            ]
        });
    
        const groupList = groups.map(group => ({
            ID: group.ID,
            name: group.name,
            studentList: group.Students.map(student => student.userId)
        }));
        return groupList;
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
    async getReceivedMessages(userID) {
        const messages = await this.Messages.findAll({
            include: [{
                model: this.User,
                through: { attributes: [] }, // Exclude the connection table fields
                where: { ID: userID }, // Filtering by UserID
            }]
        });
    
        for (let k = 0; k < messages.length; k++) {
            const theOneSender = await this.User.findOne({
                where: { ID: messages[k].senderUserID },
                attributes: ["username"]
            });
    
            // Add senderUserName inside dataValues directly
            messages[k].dataValues.senderUserName = theOneSender //? theOneSender.username : "Unknown";
        }
        return messages;
    }



}

module.exports = new MessageRepository(db);