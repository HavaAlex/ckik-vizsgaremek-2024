module.exports = (sequelize, DataTypes) => {
    const User = require("../models/user")(sequelize, DataTypes);
    const Admin = require("../models/admin")(sequelize, DataTypes);
    const Guardian = require("../models/guardian")(sequelize, DataTypes);
    const Student = require("../models/student")(sequelize, DataTypes);
    const Teacher = require("../models/teacher")(sequelize, DataTypes);

    const GuardianStudent = sequelize.define('GuardianStudent', {}, { timestamps: false });

    Guardian.belongsToMany(Student, { through: GuardianStudent });
    Student.belongsToMany(Guardian, { through: GuardianStudent });

    User.hasOne(Guardian, { foreignKey: 'roleId', sourceKey: 'ID' });
    Guardian.belongsTo(User, { foreignKey: 'roleId', targetKey: 'ID' });

    User.hasOne(Student, { foreignKey: 'roleId', sourceKey: 'ID' });
    Student.belongsTo(User, { foreignKey: 'roleId', targetKey: 'ID' });

    User.hasOne(Teacher, { foreignKey: 'roleId', sourceKey: 'ID' });
    Teacher.belongsTo(User, { foreignKey: 'roleId', targetKey: 'ID' });

    User.hasOne(Admin, { foreignKey: 'roleId', sourceKey: 'ID' });
    Admin.belongsTo(User, { foreignKey: 'roleId', targetKey: 'ID' });

    return { User, Admin, Guardian, Student, Teacher, GuardianStudent };
}