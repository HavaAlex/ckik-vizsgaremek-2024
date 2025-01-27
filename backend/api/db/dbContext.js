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

const { User,Student,Guardian,Admin, Teacher, Lesson, Groups, Timetable} = require("../models")(sequelize, DataTypes);

db.user = User;

db.student = Student;

db.guardian = Guardian;

db.admin = Admin;

db.teacher = Teacher;

db.lesson = Lesson;

db.groups = Groups;

db.timetable = Timetable;

db.sequelize.sync({ alter: true });

module.exports = db;

console.log("teszt");