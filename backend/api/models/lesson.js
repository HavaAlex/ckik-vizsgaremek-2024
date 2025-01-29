const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Lesson extends Model {};

    Lesson.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            
            Subject_ID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            Teacher_ID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            start_Hour:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            start_Minute:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            length:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            subjectName:
            {
                type: DataTypes.STRING,
                allowNull: false
            },



        },

        {
            sequelize,
            modelName: "Lesson",
            timestamps: false,
        }
    )

    return Lesson;
}