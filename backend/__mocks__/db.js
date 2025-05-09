const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:", { logging: false });

try
{
    sequelize.authenticate();

    console.log("Mocked Database Connected Successfully!");
}
catch(err)
{
    console.error("Mocked Database connection failed!");
}

const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;
 

const {User,Student,Guardian, Admin, Teacher, Lesson, Group, Mark, Message, Absence, ClassDistruption, GuardianStudent,MessageReceiver,StudentGroup
    ,Assignment, AssignmentFiles, CompletedAssignment, CompletedAssignmentFiles} = require("../api/models")(db.sequelize, DataTypes);

    db.user = User;

    db.student = Student;
    
    db.guardian = Guardian;
    
    db.admin = Admin;
    
    db.teacher = Teacher;
    
    db.lesson = Lesson;
    
    db.group = Group;
    
    db.message = Message;
    
    db.mark = Mark;
    
    db.guardianstudent = GuardianStudent;
    
    db.messagereceiver = MessageReceiver;
    
    db.studentgroup = StudentGroup;
    
    db.absence = Absence;
    
    db.classdistruption = ClassDistruption;
    
    db.assignment = Assignment
    db.assignmentFiles = AssignmentFiles
    db.completedAssignment = CompletedAssignment
    db.completedAssignmentFiles = CompletedAssignmentFiles

module.exports = db;