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


const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;

const { User,Student,Guardian,Admin, Teacher, Lesson, Groups, Timetable, Subject} = require("../models")(sequelize, DataTypes);

db.user = User;

db.student = Student;

db.guardian = Guardian;

db.admin = Admin;

db.teacher = Teacher;

db.lesson = Lesson;

db.groups = Groups;

db.timetable = Timetable;

db.subject = Subject;

sequelize.sync({ force: true })
    .then(() => {
        console.log("Database & tables created!");
    })
    .catch(err => {
        console.error("Error creating database & tables:", err);
    });

try {
    sequelize.authenticate();
    console.log("Database Connected");
} catch (err) {
    console.error("Error connecting to the database:", err);
}

module.exports = db;

console.log("teszt");