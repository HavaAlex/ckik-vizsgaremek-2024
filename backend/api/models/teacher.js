const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Teacher extends Model {};

    Teacher.init
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

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },


        },

        {
            sequelize,
            modelName: "Teacher",
            timestamps: false,
        }
    )

    return Teacher;
}