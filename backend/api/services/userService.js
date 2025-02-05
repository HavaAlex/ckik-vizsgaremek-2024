const userRepository  = require("../repositories/userRepository"); 

class UserService
{
    async createUser(user)
    {
        return await userRepository.createUser(user);
    }

    async getUsers()
    { 
        return await userRepository.getUsers();
    }

    async getUser(username)
    {
        return await userRepository.getUser(username);
    }
    async getUserByID(ID)
    {
        return await userRepository.getUser(ID);
    }

    async getUserChildren(ID)
    {
        
    }
}

module.exports = new UserService();