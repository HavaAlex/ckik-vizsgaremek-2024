const { forEach } = require("lodash");
const db = require("../db/dbContext");
const userRepository = require("./userRepository");
const { where } = require("sequelize");

class StudentRepository
{
    constructor(db)
    {
        this.Students = db.student;
        this.Groups = db.group;
        this.StudentGroups = db.studentgroup;
    }

    async createStudent(student)
    {
        const newStudent = await this.Students.build(student);

        await newStudent.save();
        
        return newStudent;
    }

    async getStudentByUserID(ID)
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

    async getStudentByID(ID)
    {
        return await this.Students.findOne
        (
            {
                where:
                {
                    ID: ID,
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

    async getGuardiansChildren(guardianId)
    {
        return this.Students.findAll(
            {
                include:{
                    model:db.guardian,
                    through:db.guardianstudent,
                    attributes:[],
                    where:{
                        ID: guardianId
                    }
                }
            }
        )
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
    async getStudentsByGroupID(GroupID){
        //console.log("ez alapján keresünk: ", GroupID)
        const students = []
        const studentIDs = await this.StudentGroups.findAll({
            where:{
                GroupID : GroupID
            }
        })
        for (let i = 0; i < studentIDs.length; i++) {
            const student = await this.Students.findOne({
                where:
                {
                    ID: studentIDs[i].StudentID,
                }
            })
            students.push(student)
        }
        return students
    }
}

module.exports = new StudentRepository(db);