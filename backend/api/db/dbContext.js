require('dotenv').config();

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize
(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
        dialect: 'mysql',
        dialectOptions: {
          // Your mysql2 options here
        },
    
    }
)

try
{
    sequelize.authenticate();

    console.log("Database Connected");
}
catch(err)
{
    console.error("Error connecting to the database");
}

const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;

const { User } = require("../models")(sequelize, DataTypes);

db.user = User;

db.sequelize.sync({ alter: true });

module.exports = db;

console.log("teszt");