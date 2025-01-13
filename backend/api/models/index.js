module.exports = (sequelize, DataTypes) =>
    {
        const user = require("../models/user")(sequelize, DataTypes);

        return { user };
    }
