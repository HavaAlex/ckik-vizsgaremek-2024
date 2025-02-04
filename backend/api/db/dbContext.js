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

const { User,Student,Guardian, Admin, Teacher, Lesson, Group, Mark, Message, Absence, ClassDistruption, GuardianStudent,MessageReceiver,StudentGroup} = require("../models")(sequelize, DataTypes);

db.user = User;

db.student = Student;

db.guardian = Guardian;

db.admin = Admin;

db.teacher = Teacher;

db.lesson = Lesson;

db.group = Group;

db.message = Message;

db.mark = Mark;

db.message = Message;

db.guardianstudent = GuardianStudent;

db.messagereceiver = MessageReceiver;

db.studentgroup = StudentGroup;

db.absence = Absence;

db.classdistruption = ClassDistruption;

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
