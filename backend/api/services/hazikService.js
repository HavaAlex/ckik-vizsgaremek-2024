const assignmentRepository = require("../repositories/assignmentRepository");
const teacherRepository = require("../repositories/teacherRepository")
const studentRepository = require("../repositories/studentRepository")
class HazikService {
    // ---------------------------------
    //             Groups
    // ---------------------------------
    async getGroups() {
        // Raw group data from the repo
        const groups = await assignmentRepository.getAllGroupsWithStudents();

        // Service layer transforms data if needed
        const groupList = groups.map(group => ({
            ID: group.ID,
            name: group.name,
            studentList: group.Students.map(student => student.ID)
        }));
        return groupList;
    }

    // ---------------------------------
    //         Create Assignment
    // ---------------------------------
    async createAssignment(newHazi, groups) {
        // 1) Convert userID -> teacherID
        const teacher = await teacherRepository.getTeacherByUserID(newHazi.teacherID);
        newHazi.teacherID = teacher.ID;

        // 2) Create the assignment
        const newAssignment = await assignmentRepository.createAssignment(newHazi);

        // 3) For each group -> for each student -> create a CompletedAssignment record
        const allStudentIDs = [];
        for (const grp of groups) {
            allStudentIDs.push(...grp.studentList);
        }
        const distinctIDs = [...new Set(allStudentIDs)]; // remove duplicates

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

    // ---------------------------------
    //       Upload Assignment Files
    // ---------------------------------
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

    // ---------------------------------
    //        Get Sent Assignments
    // ---------------------------------
    async getsentAssignments(userID) {
        await this.checkAndUpdateOverdueAssignments();
        // 1) Find the teacher by userID
        const teacher = await teacherRepository.getTeacherByUserID(userID);
        

        // 2) Get all assignments from that teacher
        const assignments = await assignmentRepository.getAssignmentsByTeacherID(teacher.ID);

        // 3) For each assignment, get all completed answers
        const result = [];
        for (const assignment of assignments) {
            const answers = await assignmentRepository.getCompletedAssignmentsByAssignmentID(assignment.ID);

            // 4) For each answer, find the student's name
            for (const ans of answers) {
                console.log("VANYASZ: ", ans)
                const student = await studentRepository.getStudentByID(ans.studentID);
                console.log("STUDNET: ", student)
                ans.dataValues.senderUserName = student.name; // attach it
            }
            console.log("őőő: ", teacher)
            assignment.dataValues.senderUserName = teacher.name

            result.push({
                feladat: assignment,
                anwsers: answers
            });
        }
        return result;
    }

    // ---------------------------------
    //      Get Received Assignments
    // ---------------------------------
    async getReceivedAssignments(userID) {
        await this.checkAndUpdateOverdueAssignments();
        // 1) Find the student row by userID
        const student  = await studentRepository.getStudentByUserID(userID);
        

        // 2) Get completed assignments by that student
        const completedAssignments = await assignmentRepository.getCompletedAssignmentsByStudentID(student.ID);

        // 3) Build an array of (valasz, feladat)
        const responseArray = [];
        for (const c of completedAssignments) {
            // get the assignment itself
            const assignment = await assignmentRepository.getAssignmentByID(c.assignmentID);
            

            responseArray.push({
                valasz: c,
                feladat: assignment
            });
        }

        // 4) For each assignment, find teacher name
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
        console.log("STUDENT IDS: ", studentIDs);
    
        const allCompletedAssignments = [];
    
        for (const sid of studentIDs) {
            console.log("Fetching assignments for student: ", sid);
            const completedAssignments = await assignmentRepository.getCompletedAssignmentsByStudentID(sid);
            console.log("Completed assignments: ", completedAssignments);
            
            // Flatten array immediately
            allCompletedAssignments.push(...completedAssignments);
        }
    
        if (allCompletedAssignments.length === 0) {
            console.log("No completed assignments found.");
            return [];
        }
    
        // Convert completed assignments to plain objects
        const plainAssignments = allCompletedAssignments.map(c => c.get({ plain: true }));
    
        // Get distinct assignment IDs
        const assignmentIDs = [...new Set(plainAssignments.map(c => c.assignmentID))];
    
        console.log("DISTINCT ASSIGNMENT IDS: ", assignmentIDs);
    
        const assignments = [];
        for (const aid of assignmentIDs) {
            const found = await assignmentRepository.getAssignmentByID(aid);
            if (found) assignments.push(found);
        }
    
        console.log("Assignments: ", assignments);
    
        // Add teacher names to assignments
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
    
            // Add student names to answers
            for (const ans of relevantAnswers) {
                const student = await studentRepository.getStudentByID(ans.dataValues.studentID);
                if (student) {
                    ans.dataValues.senderUserName = student.name;
                }
            }
    
            result.push({
                assignment: assignment.get({ plain: true }), // Convert to plain object
                answers: relevantAnswers.map(a => a.get({ plain: true })) // Convert answers too
            });
        }
    
        console.log("Final Result: ", result);
        return result;
    }
    
      




    // ---------------------------------
    //   Get Teacher Assignment Files
    // ---------------------------------
    async getTeacherAssignmentFiles(userID) {
        // Example logic: gather all assignments by this teacher, then gather all files
        const teacherArr = await assignmentRepository.getTeacherByUserID(userID);
        const teacherID = teacherArr[0].ID;

        const assignments = await assignmentRepository.getAssignmentsByTeacherID(teacherID);

        const allFiles = [];
        for (const assignment of assignments) {
            const files = await assignmentRepository.getAssignmentFiles(assignment.ID);
            allFiles.push(...files);
        }
        return allFiles;
    }

    // ---------------------------------
    //  Modify Completed Assignment
    // ---------------------------------
    async modifycompletedassignment(userID, completedassignment) {
        // userID can be used for authorization checks if needed
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

    // ---------------------------------
    //       Get Assignment Files
    // ---------------------------------
    async getAssignmentFiles(assignmentID) {
        return await assignmentRepository.getAssignmentFiles(assignmentID);
    }

    // ---------------------------------
    //   Get Completed Assignment Files
    // ---------------------------------
    async getCompletedAssignmentFiles(assignmentIDs) {
        // assignmentIDs is presumably an array of CompletedAssignment IDs
        const files = [];
        for (const id of assignmentIDs) {
            const fileRows = await assignmentRepository.getCompletedAssignmentFilesByCompletedAssignmentID(id);
            files.push(fileRows);
        }
        return files;
    }

    // ---------------------------------
    //        Delete Assignment
    // ---------------------------------
    async deleteAssignment(assignmentID) {
        // 1) Delete CompletedAssignmentFiles
        await assignmentRepository.deleteCompletedAssignmentFilesByAssignmentID(assignmentID);
        // 2) Delete CompletedAssignments
        await assignmentRepository.deleteCompletedAssignmentsByAssignmentID(assignmentID);
        // 3) Delete AssignmentFiles
        await assignmentRepository.deleteAssignmentFilesByAssignmentID(assignmentID);
        // 4) Delete Assignment
        await assignmentRepository.deleteAssignmentByID(assignmentID);

        return "sikerült";
    }

    // ---------------------------------
    //   Delete CompletedAssignmentFile
    // ---------------------------------
    async deleteCompletedAssignmentFile(ID) {
        await assignmentRepository.deleteCompletedAssignmentFileByID(ID);
        return "sikerült";
    }


    async checkAndUpdateOverdueAssignments() {
        // 1) Get all completed assignments
        const allCompletedAssignments = await assignmentRepository.getAllCompletedAssignments();
    
        // 2) For each completed assignment, check if the assignment is past its deadline
        for (const completedAssignment of allCompletedAssignments) {
            const assignment = await assignmentRepository.getAssignmentByID(completedAssignment.assignmentID);
            
            // If no assignment or no deadline, skip
            if (!assignment || !assignment.deadline) continue;
    
            const deadline = assignment.deadline;  // Date object from DB
            const now = new Date();
    
            if (deadline < now) {
                // 3) Check if there's no textAnswer and no uploaded files
                const textAnswerIsEmpty = !completedAssignment.textAnswer || completedAssignment.textAnswer.trim() === "";
    
                // If the user hasn't uploaded anything, check for completed assignment files
                if (textAnswerIsEmpty) {
                    const files = await assignmentRepository.getCompletedAssignmentFilesByCompletedAssignmentID(completedAssignment.ID);
    
                    // 4) If no files exist, mark status as "Elkésett"
                    if (files.length === 0 && completedAssignment.status !== "Határidó lejárt") {
                        await assignmentRepository.updateCompletedAssignment(completedAssignment.ID, {
                            status: "Határidó lejárt"
                        });
                    }
                }
            }
        }
    }
    


}

module.exports = new HazikService();
