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
            Student_ID:
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



        },

        {
            sequelize,
            modelName: "Marks",
            timestamps: false,
        }
    )

    return Marks;
}