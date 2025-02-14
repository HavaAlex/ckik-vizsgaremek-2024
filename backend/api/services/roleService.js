const userRepository  = require("../repositories/userRepository");

class RoleService
{
    async createRole(role)
    {
        return await userRepository.createUser(role);//TODO
    }

    async getRole(userID,userType)
    {
        return await userRepository.getRole(userID,userType);
    }
}

module.exports = new RoleService();