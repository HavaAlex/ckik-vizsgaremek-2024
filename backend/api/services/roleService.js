const userRepository  = require("../repositories/userRepository");

class RoleService
{
    async createRole(role)
    {
        return await userRepository.createUser(role);//TODO
    }

    async getRole(ID)
    {
        return await userRepository.getUserRole(ID);
    }
}

module.exports = new RoleService();