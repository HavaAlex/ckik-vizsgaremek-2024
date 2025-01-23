const db = require("../db/dbContext");

class UserRepository
{
    constructor(db)
    {
        this.Users = db.user;
        console.log(this.Users)
    }

    async createUser(user)
    {
        const newUser = await this.Users.build(user);

        await newUser.save();
        
        return newUser;
    }

    async getUsers()
    {
        return await this.Users.findAll();
    }

    async getUser(username)
    {
        return await this.Users.findOne
        (
            {
                where:
                {
                    username: username,
                }
            }
        )
    }
}

module.exports = new UserRepository(db);