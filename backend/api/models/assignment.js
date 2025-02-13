const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Assignment extends Model {};

    Assignment.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            TeacherID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            desc:
            {
                type: DataTypes.STRING(5000),
                allowNull: false,
            },
            deadline:
            {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },

        {
            sequelize,
            modelName: "Assignment",
            timestamps: false,
        }
    )

    return Assignment;
}