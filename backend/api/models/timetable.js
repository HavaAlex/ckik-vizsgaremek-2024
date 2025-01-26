const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Timetable extends Model {};

    Timetable.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
        },

        {
            sequelize,
            modelName: "Timetable",
            timestamps: false,
        }
    )

    return Timetable;
}