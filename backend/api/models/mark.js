const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Marks extends Model {};

    Marks.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            teacherID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            studentID:
            {
                type: DataTypes.INTEGER, 
                allowNull: false
            },
            Value:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            Multiplier:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            subjectName:
            {
                type: DataTypes.STRING,
                allowNull: false
            },
            date:
            {
                type: DataTypes.DATE,
                allowNull: false,
            },

        },

        {
            sequelize,
            modelName: "Marks",
            timestamps: false,
        }
    )

    return Marks;
}