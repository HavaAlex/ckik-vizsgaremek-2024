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

    async getStudentByOmId(OM_ID){
        return await this.Students.findOne({
            where:{
                OMID: OM_ID
            }
        })
    }

    async getGroupMembers(groupID)
    {
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
    async getAllStudents(){
        return await this.Students.findAll()
    }

    async modifyStudent(ID,student){
        // Assume User is a Sequelize model
        console.log("biztos ami biztos: ",ID)
        console.log("studentba  ", student)
        const changedStudent = await this.Students.findOne({ where: { userId: ID } });
        await changedStudent.update({ name: student.name });
        await changedStudent.update({ email: student.email });
        await changedStudent.update({ phone: student.phone });
        await changedStudent.update({ DoB: student.DoB });
        await changedStudent.update({ address: student.address });
        await changedStudent.update({ OMID: student.OMID });
        return changedStudent
    }
    async deleteStudent(ID){
        await this.Students.destroy({
            where:{
                userId: ID
            }
        })
    }
}

module.exports = new StudentRepository(db);