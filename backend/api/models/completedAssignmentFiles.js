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
            CompletedAssignmentID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            desc:
            {
                type: DataTypes.BLOB("long"),
                allowNull: false,
            },
        },

        {
            sequelize,
            modelName: "CompletedAssignmentFiles",
            timestamps: false,
        }
    )

    return CompletedAssignmentFiles;
}