const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Subject extends Model {};

    Subject.init
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


            
        },

        {
            sequelize,
            modelName: "Subject",
            timestamps: false,
        }
    )

    return Subject;
}