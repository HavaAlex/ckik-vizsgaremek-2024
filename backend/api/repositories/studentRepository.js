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
        console.log("REPÓBBBAAA: ",student)
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

    async getStudentByOmId(OM_ID){
        return await this.Students.findOne({
            where:{
                OMID: OM_ID
            }
        })
    }

    async getGroupMembers(groupID)
    {
        //console.log("ITTTT")
        //console.log(groupID)
        //console.log("ITTT")
        return await this.Students.findAll
        (
            {
                include: [{
                    model: db.group,
                    through: { attributes: [] },
                    where: { ID: groupID },
                }]
            }
        )
    }
}

module.exports = new StudentRepository(db);