const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class XXXXXXXXXXXXXX extends Model {};

    XXXXXXXXXXXXXX.init
    (
        {
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
            modelName: "XXXXXXXXXXXXXX",
            timestamps: false,
        }
    )

    return XXXXXXXXXXXXXX;
}