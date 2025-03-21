const { Op, where } = require("sequelize");
const db = require("../db/dbContext");
const message = require("../models/message");

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
    async getMessageReceiverByMessageID(ID){
        return await this.MessageReceiver.findAll({
            where: {MessageID: {[Op.eq]:ID} }
        })
    }
    async getMessageReceiverByUserID(ID){
        return await this.MessageReceiver.findAll({
            where: {UserID: {[Op.eq]:ID}}
        })
    }
}

module.exports = new MessageReceiverRepository(db);