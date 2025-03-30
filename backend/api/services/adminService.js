//const adminRepository = require("../repositories/adminRepository");
const teacherRepository = require("../repositories/teacherRepository");
const studentRepository = require("../repositories/studentRepository")
const groupRepository = require("../repositories/groupRepository")
const studentGroupRepository = require("../repositories/studentGroupRepository")
const UserRepository = require("../repositories/userRepository")
const GuardianStudentRepository = require("../repositories/guardianStudentRepository")
const GuardianRepository = require("../repositories/guardianRepository")
const AbsenceRepository = require("../repositories/absenceRepository")

const UserService = require("../services/userService")
const GroupService = require("../services/csoportService")
const orarendService = require("../services/orarendService")

const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const userService = require("../services/userService");
const guardianStudentRepository = require("../repositories/guardianStudentRepository");
const lessonRepository = require("../repositories/lessonRepository");
const disruptionRepository = require("../repositories/disruptionRepository");
const absence = require("../models/absence");
const absenceRepository = require("../repositories/absenceRepository");
const salt = 10;

class adminService {
    async uploadTeachers(teachers){
        const uploadedTeachers = [];
        for (let i = 0; i < teachers.length; i++) {
            if(new Date(teachers[i].birth_Date) > Date.now()){
                return -1
            }
        }
        for (let i = 0; i < teachers.length; i++) {
            const username = await UserRepository.createUserName(teachers[i].name)
            const passwordUncrypted = await UserRepository.generatePassword()
            // Create new user object with the given attributes.
            const newUser = {
                id: null,
                username: username,
                password: await bcrypt.hash(passwordUncrypted, salt),
                role: "tanar"
            };
            
            await UserRepository.createUser(newUser);
            newUser.password = passwordUncrypted;
            const user = await UserRepository.getUser(newUser.username)
            uploadedTeachers.push(newUser);
            const newTeacher = {
                id: null,
                name: newUser.username,
                phone: teachers[i].phone,
                email: teachers[i].email,
                userId: user.ID
            }
            await teacherRepository.createTeacher(newTeacher)
        }

        return uploadedTeachers
    }


    async uploadStudents(students){
        const uploadedStudents = [];
        for (let i = 0; i < students.length; i++) {
            if(new Date(students[i].birth_Date) > Date.now()){
                return -1
            }
        }
        for (let i = 0; i < students.length; i++) {
            if(students[i].name == null || students[i].birth_Date == null || students[i].address == null || students[i].phone == null || students[i].email == null || students[i].OM_ID == null){
                return -3
            }
        }
        for (let i = 0; i < students.length; i++) {
            const username = await UserRepository.createUserName(students[i].name)
            const passwordUncrypted = await UserRepository.generatePassword()
            // Create new user object with the given attributes.
            const newUser = {
                id: null,
                username: username,
                password: await bcrypt.hash(passwordUncrypted, salt),
                role: "diak"
            };
            
            if(await studentRepository.getStudentByOmId(students[i].OM_ID) != null){
                return -2
            }


            await UserRepository.createUser(newUser);
            newUser.password = passwordUncrypted;
            const user = await UserRepository.getUser(newUser.username)
            uploadedStudents.push(newUser);
            const newStudent = {
                id: null,
                name: newUser.username,
                DoB: students[i].birth_Date,
                address: students[i].address,
                phone: students[i].phone,
                email: students[i].email,
                userId: user.ID,
                OMID: students[i].OM_ID
            }
            await studentRepository.createStudent(newStudent)
        }

        return uploadedStudents
    }


    async uploadGuardians(guardians){
        
        const uploadedStudents = [];

        for (let i = 0; i < guardians.length; i++) {
            if(guardians[i].RelatedStudents.length < 1){
                return -3
            }
        }

        for (let i = 0; i < guardians.length; i++) {
            for (let j = 0; j < guardians[i].RelatedStudents.length; j++) {
                const StudentID = await studentRepository.getStudentByOmId(guardians[i].RelatedStudents[j])
                console.log(StudentID)
                if(StudentID == null){
                    return -1
                }
            }
        }

        for (let i = 0; i < guardians.length; i++) {
            if(new Date(guardians[i].birth_Date) > Date.now()){
                return -2
            }
        }

        for (let i = 0; i < guardians.length; i++) {
            const username = await UserRepository.createUserName(guardians[i].name)
            const passwordUncrypted = await UserRepository.generatePassword()
            // Create new user object with the given attributes.
            const newUser = {
                id: null,
                username: username,
                password: await bcrypt.hash(passwordUncrypted, salt),
                role: "szulo"
            };
            
            await UserRepository.createUser(newUser);
            newUser.password = passwordUncrypted;
            const user = await UserRepository.getUser(newUser.username)
            uploadedStudents.push(newUser);
            let newGuardian = {
                id: null,
                name: newUser.username, //van egy .address is majd megcsináljuk
                phone: guardians[i].phone,
                email: guardians[i].email,
                userId: user.ID
            }
            newGuardian = await GuardianRepository.createGuardian(newGuardian)
            for (let j = 0; j < guardians[i].RelatedStudents.length; j++) {
                const StudentID = await studentRepository.getStudentByOmId(guardians[i].RelatedStudents[j])
                console.log(StudentID)
                
                const newGuardianStudent = {
                    GuardianID:newGuardian.ID,
                    StudentID: StudentID.ID
                }
                await GuardianStudentRepository.createGuardianStudent(newGuardianStudent)
                
            }
        }

        return uploadedStudents
    }

    async getAllUsers(){
        const users = await userRepository.getAllUsers();
        return users
    }

    async getAllStudents(){
        return await studentRepository.getAllStudents()
    }


    async modifyUser(user, currentUsername){
        if(currentUsername == user.roleSide.name){
            const modificationResult = await userRepository.modifyUser(user)
            return modificationResult
        }
        const userNameTaken = await userRepository.getUser(user.roleSide.name)
        if(userNameTaken){
            return -2
        }
        const modificationResult = await userRepository.modifyUser(user)
        return modificationResult
    }   
    async deleteUser(ID){
        const user = await userRepository.getUserByID(ID)
        return await userRepository.deleteUser(ID, user)
    }

    async deleteAbsence(ID){
        return await userRepository.deleteAbsence(ID)
    }

    async getAllGroupsWithStudents()
    {
        const groupsWithStudentsArray = []
        const groups = await groupRepository.getAllGroups();

        for (let i = 0; i < groups.length; i++) {
            let groupsWithStudents = {
                group : groups[i],
                students: await studentRepository.getStudentsByGroupID(groups[i].ID)
            } 

            groupsWithStudentsArray.push(groupsWithStudents)
        }


        return groupsWithStudentsArray

    }

    async CreatedGroup(newGroup){

        const usersExist = await UserService.checkIfUsersExist(newGroup.StudentOMIDs)
        if(!usersExist){
            return -1 
        }

        const userNotInGroup = await userService.checkIfUsersAlreadyInGroup(newGroup.StudentOMIDs)
        if(userNotInGroup){
            return -2
        }
        const groupNameNotTaken = await GroupService.checkIfGroupNameIsNotTaken(newGroup.name)
        if(!groupNameNotTaken){
            return -3
        }



        else if(usersExist)
        {
            const newGroupForGroupTable = {
                ID: null,
                name: newGroup.name
            }
            const result = await groupRepository.createGroup(newGroupForGroupTable)
    
            for (let i = 0; i < newGroup.StudentOMIDs.length; i++) {
                const founduser = await studentRepository.getStudentByOmId(newGroup.StudentOMIDs[i])
                const newStudentGroup = {
                    GroupID: result.ID,
                    StudentID: founduser.ID
                }
                
                await studentGroupRepository.createStudentGroup(newStudentGroup)
                
            }
        }
        


    }

    async addStudentsToGroup(newGroup){
        const usersExist = await UserService.checkIfUsersExist(newGroup.StudentOMIDs)
        if(!usersExist){
            return -1
        }
        const userNotInGroup = await userService.checkIfUsersAlreadyInGroup(newGroup.StudentOMIDs)

        if(userNotInGroup){
            return -2
        }
        for (let i = 0; i < newGroup.StudentOMIDs.length; i++) {
            // await studentGroupRepository.createStudentGroup
            const student = await studentRepository.getStudentByOmId(newGroup.StudentOMIDs[i])

            const newStudentGroup = {
                GroupID: newGroup.id,
                StudentID: student.ID
            }
            await studentGroupRepository.createStudentGroup(newStudentGroup);
        }

        return "sikerült"
    }

    async deleteStudentGroup(ID){
        return await studentGroupRepository.deleteStudentGroup(ID)
    }

    async deleteGroup(ID){
        return await groupRepository.deleteGroup(ID)
    }

    async addStudentToGuardian(GuardianID, students){
        await guardianStudentRepository.deleteGurdianStudentByGuardianID(GuardianID)
        for (let i = 0; i < students.length; i++) {
            const newGuardianStudent = {
                GuardianID: GuardianID,
                StudentID: students[i].ID
            }
            console.log("KAKIÁLS _ ", newGuardianStudent)
            await guardianStudentRepository.createGuardianStudent(newGuardianStudent)
        }
        return "sikeres módosítás"
    }
    async getAllGroups()
    {
        return await groupRepository.getAllGroups()
    }

    async getAbsences(){
        const absences = await absenceRepository.getAbsences();
        return absences
    }

    async approveAbsence(absenceToBeModified){
        const absences = await absenceRepository.approveAbsence(absenceToBeModified);
        return absences
    }

    async disapproveAbsence(absenceToBeModified){
        const absences = await absenceRepository.disapproveAbsence(absenceToBeModified);
        return absences
    }

    async uploadLessons(lessons) {
        const uploaded = [];
        lessons.forEach(element => {
            orarendService.validateLesson(element);
        });
    
        const lessonPromises = lessons.map(async element => {
            let newLesson = {
                ID: undefined,
                groupID: element.groupID,
                teacherID: element.teacherID,
                start_Hour: element.start_Hour,
                start_Minute: Number(element.start_Minute) + Number(element.start_Hour) * 60,
                length: element.length,
                day: element.day,
                subjectName: element.subjectName
            };
            newLesson = await lessonRepository.createLesson(newLesson);
            //console.log(newLesson, "!!!!!!!!!!!!!!!!!!!!!!!!!!");
            uploaded.push(newLesson);
            return newLesson;
        });
    
        await Promise.all(lessonPromises);
    
        //console.log("adminService: vége a felöltésnek4", uploaded);
        return uploaded;
    }

    async uploadDisruption(disruption) {
    
        let newDisruption = {
            ID: undefined,
            date: disruption.date,
            groupID: disruption.groupID,
            teacherID: disruption.teacherID,
            start_Hour: disruption.start_Hour,
            start_Minute: Number(disruption.start_Minute) + Number(disruption.start_Hour) * 60,
            length: disruption.length,
            day: disruption.day,
            subjectName: disruption.subjectName
        };
        newDisruption = await disruptionRepository.createDisruption(newDisruption);
        return newDisruption;
    }
    
    async getAllTeachers()
    {
        return await teacherRepository.getAllTeachers()
    }

    async modifyLesson(modifiedLesson){
        return await lessonRepository.modifyLesson(modifiedLesson)
    }   

    async deleteLesson(ID){
        return await lessonRepository.deleteLesson(ID)
    }
}
module.exports = new adminService(); 