const { Op } = require("sequelize");
const db = require("../db/dbContext");

class AssignmentRepository {
    constructor(db) {
        this.User = db.user;
        this.Group = db.group;
        this.Student = db.student;
        this.Teacher = db.teacher;
        this.Assignment = db.assignment;
        this.AssignmentFile = db.assignmentFiles;
        this.CompletedAssignment = db.completedAssignment;
        this.CompletedAssignmentFile = db.completedAssignmentFiles;
    }
    async getAllGroupsWithStudents() {
        return await this.Group.findAll({
            attributes: ["ID", "name"],
            include: [
                {
                    model: this.Student,
                    attributes: ["ID"],
                    through: { attributes: [] }, 
                }
            ]
        });
    }


    async createAssignment(assignmentData) {
        const newAssignment = this.Assignment.build(assignmentData);
        await newAssignment.save();
        return newAssignment;
    }

    async getAssignmentsByTeacherID(teacherID) {
        return await this.Assignment.findAll({
            where: {
                [Op.or]: { teacherID: teacherID }
            }
        });
    }

    async getAssignmentByID(assignmentID) {
        return await this.Assignment.findOne({
            where: { ID: assignmentID }
            
        });
    }

    async deleteAssignmentByID(assignmentID) {
        return await this.Assignment.destroy({
            where: {
                ID: assignmentID
            }
        });
    }


    async createCompletedAssignment(completedAssignmentData) {
        const newCompletedAssignment = this.CompletedAssignment.build(completedAssignmentData);
        await newCompletedAssignment.save();
        return newCompletedAssignment;
    }

    async getCompletedAssignmentsByStudentID(studentID) {
        return await this.CompletedAssignment.findAll({
            where: {
                [Op.or]: {
                    studentID: studentID
                }
            }
        });
    }

    async getCompletedAssignmentsByAssignmentID(assignmentID) {
        return await this.CompletedAssignment.findAll({
            where: {
                [Op.or]: { assignmentID: assignmentID }
            }
        });
    }

    async updateCompletedAssignment(ID, updatedData) {
        const record = await this.CompletedAssignment.findOne({
            where: { ID }
        });
        if (!record) return null;
        await record.update(updatedData);
        return record;
    }

    async deleteCompletedAssignmentsByAssignmentID(assignmentID) {
        return await this.CompletedAssignment.destroy({
            where: {
                assignmentID: assignmentID
            }
        });
    }


    async uploadAssignmentFiles(files, assignmentId) {

        const uploadedFiles = await Promise.all(
            files.map(file => {
                return this.AssignmentFile.create({
                    assignmentID: assignmentId,
                    buffer: file.buffer,
                    mimetype: file.mimetype,
                    filename: file.originalname
                });
            })
        );
        return uploadedFiles;
    }

    async getAssignmentFiles(assignmentID) {
        return await this.AssignmentFile.findAll({
            where: {
                assignmentID: { [Op.eq]: assignmentID }
            }
        });
    }

    async deleteAssignmentFilesByAssignmentID(assignmentID) {
        return await this.AssignmentFile.destroy({
            where: {
                assignmentID: assignmentID
            }
        });
    }

    async uploadCompletedAssignmentFiles(files, completedAssignmentId) {
        const uploadedFiles = await Promise.all(
            files.map(file => {
                return this.CompletedAssignmentFile.create({
                    assignmentID: completedAssignmentId,
                    buffer: file.buffer,
                    mimetype: file.mimetype,
                    filename: file.originalname
                });
            })
        );
        return uploadedFiles;
    }

    async getCompletedAssignmentFilesByCompletedAssignmentID(completedAssignmentID) {
        return await this.CompletedAssignmentFile.findAll({
            where: {
                assignmentID: { [Op.eq]: completedAssignmentID }
            }
        });
    }

    async deleteCompletedAssignmentFileByID(ID) {
        return await this.CompletedAssignmentFile.destroy({
            where: {
                ID: ID
            }
        });
    }

    async deleteCompletedAssignmentFilesByAssignmentID(assignmentID) {
        return await this.CompletedAssignmentFile.destroy({
            where: {
                assignmentID: assignmentID
            }
        });
    }


    async getAllCompletedAssignments() {
        return await this.CompletedAssignment.findAll();
    }
    
}

module.exports = new AssignmentRepository(db);
