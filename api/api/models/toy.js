const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{

    class Toy extends Model {};

    Toy.init
    (
        {
            name:
            {
                type: DataTypes.STRING,
                primaryKey: true,
            },

            price:
            {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },

            company:
            {
                type: DataTypes.STRING,
                defaultValue: "Unknown",
            }
        },

        {
            sequelize,
            modelName: "Toy",
            timestamps: true,
            createdAt: "releaseDate",
            updatedAt: false,
        }
    )

    module.exports = { Toy };

    return Toy;
}