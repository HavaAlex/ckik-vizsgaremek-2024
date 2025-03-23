const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Absence extends Model {};

    Absence.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            studentID:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            teacherID:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            
            date:
            {
                type: DataTypes.DATE,
                allowNull: false
            },
            excused:
            {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }


        },

        {
            sequelize,
            modelName: "Absence",
            timestamps: false,
        }
    )

    return Absence;
}