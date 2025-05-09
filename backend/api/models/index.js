const absence = require("../models/absence");

module.exports = (sequelize, DataTypes) => {

    const User = require("../models/user")(sequelize, DataTypes);
    const Admin = require("../models/admin")(sequelize, DataTypes);
    const Guardian = require("../models/guardian")(sequelize, DataTypes);
    const Student = require("../models/student")(sequelize, DataTypes);
    const Teacher = require("../models/teacher")(sequelize, DataTypes);
    const Message = require("../models/message")(sequelize, DataTypes);
   
    /**
     * @swagger
     * components:
     *   schemas:
     *     Mark:
     *       type: object
     *       required:
     *         - teacherID
     *         - studentID
     *         - Value
     *         - Multiplier
     *         - subjectName
     *         - date
     *       properties:
     *         teacherID:
     *           type: integer
     *           description: Jegyet adó tanár
     *           example: 1
     *         studentID:
     *           type: integer
     *           description: Jegyet kapó diák
     *           example: 1
     *         Value:
     *           type: integer
     *           description: Jegy értéke
     *           example: 5
     *       additionalProperties: true
     */
    const Mark = require("../models/mark")(sequelize, DataTypes);
    const ClassDistruption = require("../models/classDisruption")(sequelize, DataTypes);
    const Group = require("../models/group")(sequelize, DataTypes);
    const Lesson = require("../models/lesson")(sequelize, DataTypes);
    const Absence = require("../models/absence")(sequelize, DataTypes);

    const Assignment = require("../models/assignment")(sequelize, DataTypes);
    const AssignmentFiles = require("../models/assignmentFiles")(sequelize, DataTypes);
    const CompletedAssignment = require("../models/completedAssignment")(sequelize, DataTypes);
    const CompletedAssignmentFiles = require("../models/completedAssignmentFiles")(sequelize, DataTypes);




    // több a többhöz kapcsolatok
    const GuardianStudent = sequelize.define('GuardianStudent', {}, { timestamps: false });
    const MessageReceiver = sequelize.define('MessageReceiver', {}, { timestamps: false });
    const StudentGroup = sequelize.define('StudentGroup', {}, { timestamps: false });



    // egy gyereknek több gondviselője is lehet, egy gondviselőnek több gyereke is lehet
    Guardian.belongsToMany(Student, { through: GuardianStudent });
    Student.belongsToMany(Guardian, { through: GuardianStudent });

    // egy üzenetnek több címzettje is lehet, egy címzettnek több üzenete is lehet
    Message.belongsTo(User, {
        as: 'sender',          
        foreignKey: 'senderUserID'
    });
    

    Message.belongsToMany(User, {
        as: 'receivers',         
        through: MessageReceiver,
        foreignKey: 'MessageID',
        otherKey: 'UserID'
    });
  
    // egy csoportnak több tanulója is lehet, egy tanulónak több csoportja is lehet
    Group.belongsToMany(Student, {through: StudentGroup});
    Student.belongsToMany(Group, {through: StudentGroup});

    User.hasMany(Message, {foreignKey: 'senderUserID'});
    Message.belongsTo(User, { foreignKey: 'senderUserID' });

    Teacher.hasMany(Lesson, {foreignKey: 'teacherID'})
    Lesson.belongsTo(Teacher, { foreignKey: 'teacherID' });

    Lesson.belongsTo(Group, {foreignKey: 'groupID'});
    Group.hasMany(Lesson, {foreignKey: 'groupID'});

    Mark.belongsTo(Teacher, {foreignKey: 'teacherID'});
    Teacher.hasMany(Mark, {foreignKey: 'teacherID'});

    Mark.belongsTo(Student, {foreignKey: 'studentID'});
    Student.hasMany(Mark, {foreignKey: 'studentID'});

    Student.belongsTo(User, { foreignKey: 'userId' });
    User.hasOne(Student, { foreignKey: 'userId' });

    Admin.belongsTo(User, { foreignKey: 'userId' });
    User.hasOne(Admin, { foreignKey: 'userId' });

    Teacher.belongsTo(User, { foreignKey: 'userId' });
    User.hasOne(Teacher, { foreignKey: 'userId' });

    Guardian.belongsTo(User, { foreignKey: 'userId' });
    User.hasOne(Guardian, { foreignKey: 'userId' });

    Absence.belongsTo(Student, {foreignKey: 'studentID'});
    Student.hasMany(Absence, {foreignKey: 'studentID'});

    Absence.belongsTo(Teacher, {foreignKey: 'teacherID'});
    Teacher.hasMany(Absence, {foreignKey: 'teacherID'});

    Absence.belongsTo(Lesson, {foreignKey: 'lessonID'});
    Lesson.hasMany(Absence, {foreignKey: 'lessonID'});
    
    ClassDistruption.belongsTo(Teacher, {foreignKey: 'teacherID'});
    Teacher.hasMany(ClassDistruption, {foreignKey: 'teacherID'});

    Assignment.hasMany(AssignmentFiles, {foreignKey: 'assignmentID'});
    AssignmentFiles.belongsTo(Assignment, { foreignKey: 'assignmentID' });

    CompletedAssignment.hasMany(CompletedAssignmentFiles, {foreignKey: 'assignmentID'});
    CompletedAssignmentFiles.belongsTo(CompletedAssignment, { foreignKey: 'assignmentID' }); 
    Assignment.belongsTo(Teacher, {foreignKey: 'teacherID'});
    Teacher.hasMany(Assignment, {foreignKey: 'teacherID'});
    CompletedAssignment.belongsTo(Student, {foreignKey: 'studentID'});
    Student.hasMany(CompletedAssignment, {foreignKey: 'studentID'});

    CompletedAssignment.belongsTo(Assignment, {foreignKey: 'assignmentID'});
    Assignment.hasMany(CompletedAssignment, {foreignKey: 'assignmentID'});

    return { User, Admin, Guardian, Student, Teacher, Message,  Group, Lesson, Mark, GuardianStudent, MessageReceiver, StudentGroup,
         Absence, ClassDistruption, Assignment, AssignmentFiles, CompletedAssignment, CompletedAssignmentFiles };
} 