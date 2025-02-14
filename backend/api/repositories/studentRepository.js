const db = require("../db/dbContext");
const userRepository = require("./userRepository")

class StudentRepository
{
    constructor(db)
    {
        this.Students = db.student;
        console.log(this.Students)
    }

    async createStudent(student)
    {
        const newStudent = await this.Students.build(student);

        await newStudent.save();
        
        return newStudent;
    }

    async getRoleByUserID(ID)
    {
        return await this.Students.findOne
        (
            {
                where:
                {
                    userId: ID,
                }
            }
        )
    }
}

module.exports = new StudentRepository(db);