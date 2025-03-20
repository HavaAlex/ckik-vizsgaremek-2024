const { Op, where } = require("sequelize");
const db = require("../db/dbContext");

const messageReceiverRepository =  require("../repositories/messageReceiverRepository")

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
        const distinctmessageReceivers = new Set(messageReceivers) 
        for (const element of distinctmessageReceivers) {
            const newMessageReceiver = {
                MessageID: newMessage.ID,
                UserID: element,
            }
            await messageReceiverRepository.createMessageReciever(newMessageReceiver)
        }       
        return newMessage;
    }
    async getPotentialReceivers(userID){
        return await this.User.findAll({ 
            where: {
                ID:{[Op.ne]:userID} 
            },
            attributes: ['ID','username','role']
        });
    }

    async getPotentialGroups() {
        const groups = await this.Group.findAll({
            attributes: ['ID', 'name'],
            include: [
                {
                    model: this.Student,
                    attributes: ['userId'],
                    through: { attributes: [] }, 
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
    
    async getSentMessages(ID) {
        const messages = await this.Messages.findAll({
          where: { senderUserID: ID },
          include: [
            {
              model: this.User,
              as: 'receivers',
              attributes: ['ID', 'username'],
              through: { attributes: [] }, 
            },
            {
              model: this.User,
              as: 'sender',
              attributes: ['ID', 'username']
            }
          ]
        });
      
        return messages;
      }
      
      
    async getMessageByID(messageID)
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
          include: [
            {
              model: this.User,
              as: 'receivers',
              attributes: ['ID', 'username'],
              through: { attributes: [] },
              required: true,
              where: { ID: userID }
            },
            {
              model: this.User,
              as: 'sender',
              attributes: ['ID', 'username']
            }
          ]
        });
        return messages;
      }
      
      
    async getAllMessages() {
        return await this.Messages.findAll({
            include: [
                {
                    model: this.User,
                    as: 'sender',
                    attributes: ['ID', 'username']
                },
                {
                    model: this.User,
                    as: 'receivers',
                    attributes: ['ID', 'username'],
                    through: { attributes: [] } 
                }
            ]
        });
    }
    async deleteMessage(ID){
        await this.Messages.destroy({
            where: {ID : ID}
        })
        return "Sikeres törlés"
    }

    



}

module.exports = new MessageRepository(db);