const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Guardian extends Model {};

    Guardian.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            
            name:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },

            phone:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
            
            email:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },


        },

        {
            sequelize,
            modelName: "Guardian",
            timestamps: false,
        }
    )

    return Guardian;
}