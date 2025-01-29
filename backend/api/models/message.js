const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Message extends Model {};

    Message.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            senderUserID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            message:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date:
            {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },

        {
            sequelize,
            modelName: "Message",
            timestamps: false,
        }
    )

    return Message;
}