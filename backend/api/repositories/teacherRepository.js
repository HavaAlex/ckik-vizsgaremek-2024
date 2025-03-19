const db = require("../db/dbContext");
const teacher = require("../models/teacher");
const userRepository = require("./userRepository")

class TeacherRepository
{
    constructor(db)
    {
        this.Teachers = db.teacher;
        console.log(this.Teachers)
    }

    async createTeacher(teacher)
    {
        const newTeacher = await this.Teachers.build(teacher);

        await newTeacher.save();
        
        return newTeacher;
    }

    async getTeacherByUserID(ID)
    {
        return await this.Teachers.findOne
        (
            {
                where:
                {
                    userId: ID,
                }
            }
        )
    }

    async getAllTeachers(){
        return await this.Teachers.findAll({})
    }

    async getTeacherByID(ID)
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
    
    async modifyTeacher(ID,teacher){
        // Assume User is a Sequelize model
        console.log("biztos ami biztos: ",ID)
        console.log("techerbe  ", teacher)
        const changedTeacher = await this.Teachers.findOne({ where: { userId: ID } });
        await changedTeacher.update({ name: teacher.name });
        await changedTeacher.update({ email: teacher.email });
        await changedTeacher.update({ phone: teacher.phone });
        return changedTeacher
    }

    async deleteTeacher(ID){
        await this.Teachers.destroy({
            where:{
                userId: ID
            }
        })
    }

}

module.exports = new TeacherRepository(db);