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
            
            Subject_id:
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
            start_Minue:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            length:
            {
                type: DataTypes.INTEGER,
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