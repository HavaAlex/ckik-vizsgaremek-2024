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
            AssignmentID:
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
            modelName: "AssignmentFiles",
            timestamps: false,
        }
    )

    return AssignmentFiles;
}