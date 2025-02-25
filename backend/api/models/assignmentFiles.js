const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class AssignmentFiles extends Model {};

    AssignmentFiles.init
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
            buffer:
            {
                type: DataTypes.BLOB("long"),
                allowNull: false,
            },
            mimetype:{
                type: DataTypes.STRING(500),
                allowNull:false
            },
            filename:{
                type: DataTypes.STRING(500),
                allowNull:false
            }

        },

        {
            sequelize,
            modelName: "AssignmentFiles",
            timestamps: false,
        }
    )

    return AssignmentFiles;
}