const { where } = require("sequelize");
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
}

module.exports = new MessageReceiverRepository(db);