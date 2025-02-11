const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class User extends Model {};

    User.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            username:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },


            password:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },

            role: {
                type: DataTypes.ENUM('diak', 'tanar', 'szulo', 'admin'),
                allowNull: false,
            },

        },

        {
            sequelize,
            modelName: "User",
            timestamps: false,
        }
    )

    return User;
}