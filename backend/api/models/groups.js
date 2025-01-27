const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Groups extends Model {};

    Groups.init
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

            Timetable_ID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },


        },

        {
            sequelize,
            modelName: "Groups",
            timestamps: false,
        }
    )

    return Groups;
}