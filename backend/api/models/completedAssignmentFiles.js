const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class CompletedAssignmentFiles extends Model {};

    CompletedAssignmentFiles.init
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
            modelName: "CompletedAssignmentFiles",
            timestamps: false,
        }
    )

    return CompletedAssignmentFiles;
}