const db = require("../db/dbContext");

class MarkRepository
{
    constructor(db)
    {
        this.Marks = db.mark;
    }

    async createMark(mark)
    {
        const newMark = await this.Marks.build(mark);

        await newMark.save();
        
        return newMark;
    }

    async getMarks(ID)//megkeresi az összes üzenetet egy felhasználótól
    {
        return await this.Marks.findAll
        (
            {
                where:
                {
                    Student_ID: ID,
                }
            }
        )
    }
}

module.exports = new MarkRepository(db);