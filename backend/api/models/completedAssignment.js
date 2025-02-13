const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class CompletedAssignment extends Model {};

    CompletedAssignment.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            assignmentID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            studentID:
            {
                type: DataTypes.STRING(5000),
                allowNull: false,
            },
            date:
            {
                type: DataTypes.DATE,
                allowNull: false,
            },
            textAnswer:{
                type: DataTypes.STRING(5000),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('completed','not viewed','not complated','late'),
                allowNull: false,
            },
        },

        {
            sequelize,
            modelName: "CompletedAssignment",
            timestamps: false,
        }
    )

    return CompletedAssignment;
}