const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Admin extends Model {};

    Admin.init
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
            modelName: "Admin",
            timestamps: false,
        }
    )

    return Admin;
}