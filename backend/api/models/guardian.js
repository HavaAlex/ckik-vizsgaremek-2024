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

            username:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
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