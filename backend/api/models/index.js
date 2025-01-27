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

    const GuardianStudent = sequelize.define('GuardianStudent', {}, { timestamps: false });
    const MessageReceiver = sequelize.define('MessageReceiver', {}, { timestamps: false });
    const GroupTimetable = sequelize.define('GroupTimetable', {}, { timestamps: false });
    const GroupUsers = sequelize.define('GroupUsers', {}, { timestamps: false });


    Guardian.belongsToMany(Student, { through: GuardianStudent });
    Student.belongsToMany(Guardian, { through: GuardianStudent });

    Message.belongsToMany(Receiver, { through: MessageReceiver });
    Receiver.belongsToMany(Message, { through: MessageReceiver });

    Groups.belongsToMany(Timetable, { through: GroupTimetable });
    Timetable.belongsToMany(Groups, { through: GroupTimetable });

    Groups.belongsToMany(User, {through: GroupUsers});
    User.belongsToMany(Groups, {through: GroupUsers});//azért több mert egy tanár több csoportnak is tarthat órarendet

    return { User, Admin, Guardian, Student, Teacher, Message, Receiver, Timetable, Groups, Lesson , GuardianStudent, MessageReceiver, GroupTimetable };
}