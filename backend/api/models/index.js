module.exports = (sequelize, DataTypes) => {
    const User = require("../models/user")(sequelize, DataTypes);
    const Admin = require("../models/admin")(sequelize, DataTypes);
    const Guardian = require("../models/guardian")(sequelize, DataTypes);
    const Student = require("../models/student")(sequelize, DataTypes);
    const Teacher = require("../models/teacher")(sequelize, DataTypes);
    const Message = require("../models/message")(sequelize, DataTypes);
    const Receiver = require("../models/receiver")(sequelize, DataTypes);


    const Timetable = require("../models/timetable")(sequelize, DataTypes);
    const Group = require("./group")(sequelize, DataTypes);
    const Lesson = require("../models/lesson")(sequelize, DataTypes);
    const Subject = require("../models/subject")(sequelize, DataTypes);


    // több a többhöz kapcsolatok
    const GuardianStudent = sequelize.define('GuardianStudent', {}, { timestamps: false });
    const MessageReceiver = sequelize.define('MessageReceiver', {}, { timestamps: false });
    const GroupTimetable = sequelize.define('GroupTimetable', {}, { timestamps: false });
    const LessonTimetable = sequelize.define('LessonTimetable', {}, { timestamps: false });
    const StudentGroup = sequelize.define('StudentGroup', {}, { timestamps: false });



    // egy gyereknek több gondviselője is lehet, egy gondviselőnek több gyereke is lehet
    Guardian.belongsToMany(Student, { through: GuardianStudent });
    Student.belongsToMany(Guardian, { through: GuardianStudent });

    // egy üzenetnek több címzettje is lehet, egy címzettnek több üzenete is lehet
    Message.belongsToMany(Receiver, { through: MessageReceiver });
    Receiver.belongsToMany(Message, { through: MessageReceiver });

    // egy csoportnak több órarendje???? is lehet, egy órarendnek több csoportja???? is lehet
    Group.belongsToMany(Timetable, { through: GroupTimetable });
    Timetable.belongsToMany(Group, { through: GroupTimetable} );

    // egy tanárnak több órarendje??? is lehet, egy órarendnek több tanára is lehet????
    Lesson.belongsToMany(Timetable, { through: LessonTimetable });
    Timetable.belongsToMany(Lesson, { through: LessonTimetable });

    // egy csoportnak több tanulója is lehet, egy tanulónak több csoportja is lehet
    Group.belongsToMany(Student, {through: StudentGroup});
    Student.belongsToMany(Group, {through: StudentGroup});


    Student.hasMany(Group, {foreignKey: 'Group_ID'})
    Group.belongsTo(Student, { foreignKey: 'Group_ID' });

    User.hasMany(Message, {foreignKey: 'senderUserID'});
    Message.belongsTo(User, { foreignKey: 'senderUserID' });

    User.hasMany(Receiver, {foreignKey: 'receiverUserID'})
    Receiver.belongsTo(User, { foreignKey: 'receiverUserID' });

    Teacher.hasMany(Lesson, {foreignKey: 'Teacher_ID'})
    Lesson.belongsTo(Teacher, { foreignKey: 'Teacher_ID' });

    Subject.hasMany(Lesson, {foreignKey: 'Subject_ID'});
    Lesson.belongsTo(Subject, { foreignKey: 'Subject_ID' });


    return { User, Admin, Guardian, Student, Teacher, Message, Receiver, Timetable, Group, Lesson ,Subject, GuardianStudent, MessageReceiver, GroupTimetable, LessonTimetable };
} 