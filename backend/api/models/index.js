const lesson = require("../models/lesson");

module.exports = (sequelize, DataTypes) => {
    const User = require("../models/user")(sequelize, DataTypes);
    const Admin = require("../models/admin")(sequelize, DataTypes);
    const Guardian = require("../models/guardian")(sequelize, DataTypes);
    const Student = require("../models/student")(sequelize, DataTypes);
    const Teacher = require("../models/teacher")(sequelize, DataTypes);
    const Message = require("../models/message")(sequelize, DataTypes);
    const Receiver = require("../models/receiver")(sequelize, DataTypes);
    const Mark = require("../models/mark")(sequelize, DataTypes);

    const Group = require("../models/group")(sequelize, DataTypes);
    const Lesson = require("../models/lesson")(sequelize, DataTypes);

    
    // több a többhöz kapcsolatok
    const GuardianStudent = sequelize.define('GuardianStudent', {}, { timestamps: false });
    const MessageReceiver = sequelize.define('MessageReceiver', {}, { timestamps: false });
    const StudentGroup = sequelize.define('StudentGroup', {}, { timestamps: false });



    // egy gyereknek több gondviselője is lehet, egy gondviselőnek több gyereke is lehet
    Guardian.belongsToMany(Student, { through: GuardianStudent });
    Student.belongsToMany(Guardian, { through: GuardianStudent });

    // egy üzenetnek több címzettje is lehet, egy címzettnek több üzenete is lehet
    Message.belongsToMany(Receiver, { through: MessageReceiver });
    Receiver.belongsToMany(Message, { through: MessageReceiver });

    // egy csoportnak több tanulója is lehet, egy tanulónak több csoportja is lehet
    Group.belongsToMany(Student, {through: StudentGroup});
    Student.belongsToMany(Group, {through: StudentGroup});

    User.hasMany(Message, {foreignKey: 'senderUserID'});
    Message.belongsTo(User, { foreignKey: 'senderUserID' });

    User.hasMany(Receiver, {foreignKey: 'receiverUserID'})
    Receiver.belongsTo(User, { foreignKey: 'receiverUserID' });

    Teacher.hasMany(Lesson, {foreignKey: 'Teacher_ID'})
    Lesson.belongsTo(Teacher, { foreignKey: 'Teacher_ID' });

    Group.belongsTo(Lesson, {foreignKey: 'Lesson_ID'});
    Lesson.hasMany(Group, {foreignKey: 'Lesson_ID'});

    Mark.belongsTo(Teacher, {foreignKey: 'Teacher_ID'});
    Teacher.hasMany(Mark, {foreignKey: 'Teacher_ID'});

    Mark.belongsTo(Student, {foreignKey: 'Student_ID'});
    Student.hasMany(Mark, {foreignKey: 'Student_ID'});

    //todo nem kell userid a userben, elég ha az id-t használjuk.
    //todo orarend


    return { User, Admin, Guardian, Student, Teacher, Message, Receiver, Group, Lesson, Mark, GuardianStudent, MessageReceiver, StudentGroup};
} 