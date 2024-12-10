const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Shop extends Model {};

    Shop.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            ownerName:
            {
                type: DataTypes.STRING(30),
                defaultValue: "Name",
                allowNull: true,
            }
        },
        
        {
            sequelize,
            modelName: "Shop",
            timestamps: true,
            createdAt: "releaseDate",
            updatedAt: false,
        }
    )

    module.exports = { Shop };

    const Toy = require("./toy").Toy;

    Shop.Toys = Shop.hasMany(Toy, 
    {
        foreignKey:
        {
            name: "shopID",
            allowNull: false,
        }
    });

    return Shop;
}