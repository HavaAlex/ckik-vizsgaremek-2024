const db = require("../db/dbContext");

class MarkRepository
{
    constructor(db)
    {
        this.Marks = db.mark;
    }

    async createMark(mark)
    {
        const newMark = await this.Marks.create(mark);

        await newMark.save();
        
        return newMark;
    }

    async getMarksUser(userID)
    {
        return await this.Marks.findAll
        (
            {
                where:
                {
                    studentID: userID,
                }
            }
        )
    }
    async getMarksByGroup(groupID) {
        return await this.Marks.findAll({
            include: [
                {
                    model: db.student,
                    attributes:["name"],
                    required: true,
                    include: [
                        {
                            model: db.group,
                            attributes: [],
                            through: { attributes: [] },
                            where: { ID: groupID },
                            required: true
                        }
                    ]
                }
            ]
        });
    }
    
    async deleteMark(ID){
        await this.Marks.destroy({
            where: {ID : ID}
        })
        return "Jegy eltávolítva"
    }
}

module.exports = new MarkRepository(db);