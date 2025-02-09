const db = require("../db/dbContext");

class GroupRepository
{
    constructor(db)
    {
        this.Groups = db.group;
    }

    async createGroup(group)
    {
        const newGroup = await this.Groups.build(group);

        await newGroup.save();
        
        return newGroup;
    }
}

module.exports = new GroupRepository(db);