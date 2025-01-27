const db = require("../db/dbContext");
const teacher = require("../models/teacher");
const userRepository = require("./userRepository")

class TeacherRepository
{
    constructor(db)
    {
        this.Teachers = db.admin;
        console.log(this.Teachers)
    }

    async createTeacher(teacher)
    {
        const newTeacher = await this.Teachers.build(teacher);

        await newTeacher.save();
        
        return newTeacher;
    }

    async getRoleByUserID(ID)
    {
        return await this.Teachers.findOne
        (
            {
                where:
                {
                    ID: ID,
                }
            }
        )
    }
}

module.exports = new TeacherRepository(db);