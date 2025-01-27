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
    const GuardianStudent = sequelize.define('GuardianStudent', {}, { timestamps: false });
    const MessageReceiver = sequelize.define('MessageReceiver', {}, { timestamps: false });
    const GroupTimetable = sequelize.define('GroupTimetable', {}, { timestamps: false });
    //const GroupUsers = sequelize.define('GroupUsers', {}, { timestamps: false });
    const LessonTimetable = sequelize.define('LessonTimetable', {}, { timestamps: false });


    Guardian.belongsToMany(Student, { through: GuardianStudent });
    Student.belongsToMany(Guardian, { through: GuardianStudent });

    Message.belongsToMany(Receiver, { through: MessageReceiver });
    Receiver.belongsToMany(Message, { through: MessageReceiver });

    Groups.belongsToMany(Timetable, { through: GroupTimetable });//ez lesz a rész ami hibát ad
    Timetable.belongsToMany(Groups, { through: GroupTimetable, foreignKey: 'ID'} );

    Lesson.belongsToMany(Timetable, { through: LessonTimetable });
    Timetable.belongsToMany(Lesson, { through: LessonTimetable });

    User.hasMany(Groups, {foreignKey: 'ID'})
    Groups.belongsTo(User, { foreignKey: 'Group_ID' });

    User.hasMany(Message, {foreignKey: 'senderUserID'})
    Message.belongsTo(User, { foreignKey: 'ID' });

    User.hasMany(Receiver, {foreignKey: 'receiverUserID'})
    Receiver.belongsTo(User, { foreignKey: 'ID' });

    Teacher.hasMany(Lesson, {foreignKey: 'Teacher_ID'})
    Lesson.belongsTo(Teacher, { foreignKey: 'ID' });

    Subject.hasMany(Lesson, {foreignKey: 'Subject_ID'})
    //Subject.belongsToMany(Lesson, { foreignKey: 'ID' });

    /*Groups.belongsToMany(User, {through: GroupUsers});t
    User.belongsToMany(Groups, {through: GroupUsers});*///azért több mert egy tanár több csoportnak is tarthat órarendet

    return { User, Admin, Guardian, Student, Teacher, Message, Receiver, Timetable, Groups, Lesson ,Subject, GuardianStudent, MessageReceiver, GroupTimetable };
} 