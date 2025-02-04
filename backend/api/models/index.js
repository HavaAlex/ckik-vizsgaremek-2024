module.exports = (sequelize, DataTypes) => {
    const User = require("../models/user")(sequelize, DataTypes);
    const Admin = require("../models/admin")(sequelize, DataTypes);
    const Guardian = require("../models/guardian")(sequelize, DataTypes);
    const Student = require("../models/student")(sequelize, DataTypes);
    const Teacher = require("../models/teacher")(sequelize, DataTypes);
    const Message = require("../models/message")(sequelize, DataTypes);
   
    const Mark = require("../models/mark")(sequelize, DataTypes);
    const ClassDistruption = require("../models/classDisruption")(sequelize, DataTypes);
    const Group = require("../models/group")(sequelize, DataTypes);
    const Lesson = require("../models/lesson")(sequelize, DataTypes);
    const Absence = require("../models/absence")(sequelize, DataTypes);


    // több a többhöz kapcsolatok
    const GuardianStudent = sequelize.define('GuardianStudent', {}, { timestamps: false });
    const MessageReceiver = sequelize.define('MessageReceiver', {}, { timestamps: false });
    const StudentGroup = sequelize.define('StudentGroup', {}, { timestamps: false });



    // egy gyereknek több gondviselője is lehet, egy gondviselőnek több gyereke is lehet
    Guardian.belongsToMany(Student, { through: GuardianStudent });
    Student.belongsToMany(Guardian, { through: GuardianStudent });

    // egy üzenetnek több címzettje is lehet, egy címzettnek több üzenete is lehet
    Message.belongsToMany(User, { through: MessageReceiver });
    User.belongsToMany(Message, { through: MessageReceiver });

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
    
    ClassDistruption.belongsTo(Teacher, {foreignKey: 'teacherID'});
    Teacher.hasMany(ClassDistruption, {foreignKey: 'teacherID'});



    return { User, Admin, Guardian, Student, Teacher, Message,  Group, Lesson, Mark, GuardianStudent, MessageReceiver, StudentGroup, Absence, ClassDistruption };
} 