<<<<<<< HEAD
const User = require("./user");

module.exports = { User };
=======
module.exports = (sequelize, DataTypes) =>
    {
        const user = require("../models/user")(sequelize, DataTypes);

        return { user };
    }
>>>>>>> 06c947dadab9077a2caf580ad205e8493aff9b31
