require('dotenv').config();

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize
(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
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

db.toys = require("../models/toy")(db.sequelize, DataTypes);

db.shops = require("../models/toy")(db.sequelize, DataTypes);

db.sequelize.sync({ alter: true });

module.exports = db;