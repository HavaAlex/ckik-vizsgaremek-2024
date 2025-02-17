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
    
    async getGroupMembers(groupID)
    {
        return await userRepository.getGroupMembers(groupID);
    }
}

module.exports = new RoleService();