module.exports = (sequelize, DataTypes) => {
    const User = require("../models/user")(sequelize, DataTypes);
    const Admin = require("../models/admin")(sequelize, DataTypes);
    const Guardian = require("../models/guardian")(sequelize, DataTypes);
    const Student = require("../models/student")(sequelize, DataTypes);
    const Teacher = require("../models/teacher")(sequelize, DataTypes);
    const Message = require("../models/message")(sequelize, DataTypes);
    const Receiver = require("../models/receiver")(sequelize, DataTypes);
    const Timetable = require("../models/timetable")(sequelize, DataTypes);
    const Groups = require("../models/groups")(sequelize, DataTypes);
    const Lesson = require("../models/lesson")(sequelize, DataTypes);
    const Subject = require("../models/subject")(sequelize, DataTypes);


    // több a többhöz kapcsolatok
    const GuardianStudent = sequelize.define('GuardianStudent', {}, { timestamps: false });
    const MessageReceiver = sequelize.define('MessageReceiver', {}, { timestamps: false });
    const GroupTimetable = sequelize.define('GroupTimetable', {}, { timestamps: false });
    //const GroupUsers = sequelize.define('GroupUsers', {}, { timestamps: false });
    const LessonTimetable = sequelize.define('LessonTimetable', {}, { timestamps: false });



    // egy gyereknek több gondviselője is lehet, egy gondviselőnek több gyereke is lehet
    Guardian.belongsToMany(Student, { through: GuardianStudent });
    Student.belongsToMany(Guardian, { through: GuardianStudent });

    // egy üzenetnek több címzettje is lehet, egy címzettnek több üzenete is lehet
    Message.belongsToMany(Receiver, { through: MessageReceiver });
    Receiver.belongsToMany(Message, { through: MessageReceiver });

    // egy csoportnak több órarendje is lehet, egy órarendnek több csoportja is lehet
    Groups.belongsToMany(Timetable, { through: GroupTimetable });
    Timetable.belongsToMany(Groups, { through: GroupTimetable} );

    // egy tanárnak több órája is lehet, egy órának több tanára is lehet
    Lesson.belongsToMany(Timetable, { through: LessonTimetable });
    Timetable.belongsToMany(Lesson, { through: LessonTimetable });


    Student.hasMany(Groups, {foreignKey: 'Group_ID'})
    Groups.belongsTo(Student, { foreignKey: 'Group_ID' });

    Message.belongsTo(User, { foreignKey: 'senderUserID' });
    User.hasMany(Message, {foreignKey: 'senderUserID'});

    User.hasMany(Receiver, {foreignKey: 'receiverUserID'})
    Receiver.belongsTo(User, { foreignKey: 'receiverUserID' });

    Teacher.hasMany(Lesson, {foreignKey: 'Teacher_ID'})
    Lesson.belongsTo(Teacher, { foreignKey: 'Teacher_ID' });

    Subject.hasMany(Lesson, {foreignKey: 'Subject_ID'})
    // Subject.belongsToMany(Lesson, { foreignKey: 'ID' });

    /*Groups.belongsToMany(User, {through: GroupUsers});
    User.belongsToMany(Groups, {through: GroupUsers});*///azért több mert egy tanár több csoportnak is tarthat órarendet

    return { User, Admin, Guardian, Student, Teacher, Message, Receiver, Timetable, Groups, Lesson ,Subject, GuardianStudent, MessageReceiver, GroupTimetable };
} 