const assignmentRepository = require("../repositories/assignmentRepository");
const teacherRepository = require("../repositories/teacherRepository")
const studentRepository = require("../repositories/studentRepository")
class HazikService {

    async getGroups() {
        const groups = await assignmentRepository.getAllGroupsWithStudents();
        const groupList = groups.map(group => ({
            ID: group.ID,
            name: group.name,
            studentList: group.Students.map(student => student.ID)
        }));
        return groupList;
    }

    async createAssignment(newHazi, groups) {

        const teacher = await teacherRepository.getTeacherByUserID(newHazi.teacherID);
        newHazi.teacherID = teacher.ID;

        const newAssignment = await assignmentRepository.createAssignment(newHazi);

        const allStudentIDs = [];
        for (const grp of groups) {
            allStudentIDs.push(...grp.studentList);
        }
        const distinctIDs = [...new Set(allStudentIDs)];

        for (const studentID of distinctIDs) {
            const completedAssignmentData = {
                assignmentID: newAssignment.ID,
                studentID: studentID,
                date: new Date(),
                textAnswer: "",
                status: "Nincs leadva"
            };
            await assignmentRepository.createCompletedAssignment(completedAssignmentData);
        }

        return newAssignment;
    }
    async uploadAssignmentFiles(files, assignmentId) {
        const uploadedFiles = await assignmentRepository.uploadAssignmentFiles(files, assignmentId);
        return {
            message: "Files uploaded successfully",
            uploadedFiles
        };
    }

    async uploadCompletedAssignmentFiles(files, completedAssignmentId) {
        const uploadedFiles = await assignmentRepository.uploadCompletedAssignmentFiles(files, completedAssignmentId);
        return {
            message: "Files uploaded successfully",
            uploadedFiles
        };
    }


    async getsentAssignments(userID) {
        await this.checkAndUpdateOverdueAssignments();
        const teacher = await teacherRepository.getTeacherByUserID(userID);
        const assignments = await assignmentRepository.getAssignmentsByTeacherID(teacher.ID);
        const result = [];
        for (const assignment of assignments) {
            const answers = await assignmentRepository.getCompletedAssignmentsByAssignmentID(assignment.ID);
            for (const ans of answers) {
                const student = await studentRepository.getStudentByID(ans.studentID);
                ans.dataValues.senderUserName = student.name;
            }
            assignment.dataValues.senderUserName = teacher.name

            result.push({
                feladat: assignment,
                anwsers: answers
            });
        }
        return result;
    }


    async getReceivedAssignments(userID) {
        await this.checkAndUpdateOverdueAssignments();

        const completedAssignments = await assignmentRepository.getCompletedAssignmentsByStudentID(userID);

        const responseArray = [];
        for (const c of completedAssignments) {

            const assignment = await assignmentRepository.getAssignmentByID(c.assignmentID);
            

            responseArray.push({
                valasz: c,
                feladat: assignment
            });
        }


        for (const item of responseArray) {
            const teacher = await teacherRepository.getTeacherByID(item.feladat.teacherID);
            item.feladat.dataValues.senderUserName = teacher.name;
        }
        return responseArray;
    }

    async getAssignmentsAndAnswersByGroupID(groupID) {
        await this.checkAndUpdateOverdueAssignments();
        const group = await studentRepository.getStudentsByGroupID(groupID);
        if (!group) return [];
    
        const studentIDs = group.map(s => s.ID);
        const allCompletedAssignments = [];
    
        for (const sid of studentIDs) {
            const completedAssignments = await assignmentRepository.getCompletedAssignmentsByStudentID(sid);
            allCompletedAssignments.push(...completedAssignments);
        }
    
        if (allCompletedAssignments.length === 0) {
            return [];
        }
        const plainAssignments = allCompletedAssignments.map(c => c.get({ plain: true }));
        const assignmentIDs = [...new Set(plainAssignments.map(c => c.assignmentID))];
        const assignments = [];
        for (const aid of assignmentIDs) {
            const found = await assignmentRepository.getAssignmentByID(aid);
            if (found) assignments.push(found);
        }
        for (const item of assignments) {
            const teacher = await teacherRepository.getTeacherByID(item.dataValues.teacherID);
            if (teacher) {
                item.dataValues.senderUserName = teacher.name;
            }
        }
    
        const result = [];
    
        for (const assignment of assignments) {
            const relevantAnswers = allCompletedAssignments.filter(
                ca => ca.dataValues.assignmentID === assignment.dataValues.ID
            );
    

            for (const ans of relevantAnswers) {
                const student = await studentRepository.getStudentByID(ans.dataValues.studentID);
                if (student) {
                    ans.dataValues.senderUserName = student.name;
                }
            }
    
            result.push({
                assignment: assignment.get({ plain: true }), 
                answers: relevantAnswers.map(a => a.get({ plain: true }))
            });
        }
        return result;
    }


    async modifycompletedassignment(completedassignment) {

        const updated = await assignmentRepository.updateCompletedAssignment(
            completedassignment.ID,
            {
                textAnswer: completedassignment.textAnswer,
                date: completedassignment.date,
                status: "Leadva"
            }
        );
        return updated;
    }


    async getAssignmentFiles(assignmentID) {
        return await assignmentRepository.getAssignmentFiles(assignmentID);
    }


    async getCompletedAssignmentFiles(assignmentIDs) {

        const files = [];
        for (const id of assignmentIDs) {
            const fileRows = await assignmentRepository.getCompletedAssignmentFilesByCompletedAssignmentID(id);
            files.push(fileRows);
        }
        return files;
    }

    async deleteAssignment(assignmentID) {
        await assignmentRepository.deleteCompletedAssignmentsByAssignmentID(assignmentID);
        //await assignmentRepository.deleteAssignmentFilesByAssignmentID(assignmentID);
        await assignmentRepository.deleteAssignmentByID(assignmentID);
        return "sikerült";
    }

    async deleteCompletedAssignmentFile(ID) {
        await assignmentRepository.deleteCompletedAssignmentFileByID(ID);
        return "sikerült";
    }


    async checkAndUpdateOverdueAssignments() { // minden házifeladatatokka kapcsolatos lekérés elején lefut
                                                //átállítja egy feladat státuszát ha lejárt a határidő és nincs szöveges válasz vagy feltöltött fájlok
        const allCompletedAssignments = await assignmentRepository.getAllCompletedAssignments();

        for (const completedAssignment of allCompletedAssignments) {
            const assignment = await assignmentRepository.getAssignmentByID(completedAssignment.assignmentID);
            

            if (!assignment || !assignment.deadline) continue;
    
            const deadline = assignment.deadline; 
            const now = new Date();
    
            if (deadline < now) {

                const textAnswerIsEmpty = !completedAssignment.textAnswer || completedAssignment.textAnswer.trim() === "";
    
   
                if (textAnswerIsEmpty) {
                    const files = await assignmentRepository.getCompletedAssignmentFilesByCompletedAssignmentID(completedAssignment.ID);
    

                    if (files.length === 0 && completedAssignment.status !== "Határidő lejárt") {
                        await assignmentRepository.updateCompletedAssignment(completedAssignment.ID, {
                            status: "Határidő lejárt"
                        });
                    }
                }
            }
        }
    }
    


}

module.exports = new HazikService();
