const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Receiver extends Model {};

    Receiver.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            receiverUserID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },

        {
            sequelize,
            modelName: "Receiver",
            timestamps: false,
        }
    )

    return Receiver;
}