//const adminRepository = require("../repositories/adminRepository");
const teacherRepository = require("../repositories/teacherRepository");
const studentRepository = require("../repositories/studentRepository")
const groupRepository = require("../repositories/groupRepository")
const studentGroupRepository = require("../repositories/studentGroupRepository")
const UserRepository = require("../repositories/userRepository")
const GuardianStudentRepository = require("../repositories/guardianStudentRepository")
const GuardianRepository = require("../repositories/guardianRepository")

const UserService = require("../services/userService")

const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const userService = require("../services/userService");
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
                console.log("ŐT KERESSÜK ADMIN SZERÓ BA ", guardians[i].RelatedStudents[j] )
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
                console.log("ŐT KERESSÜK ADMIN SZERÓ BA ", guardians[i].RelatedStudents[j] )
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
        console.log("mindenki: ", users)
        return users
    }
    async modifyUser(user){
        const modificationResult = await userRepository.modifyUser(user)
        return modificationResult
    }   
    async deleteUser(ID){
        const user = await userRepository.getUserByID(ID)
        return await userRepository.deleteUser(ID, user)
    }

    async getAllGroupsWithStudents()
    {
        const groupsWithStudentsArray = []
        const groups = await groupRepository.getAllGroups();
        //console.log("ÉN VAGYOK A GROUP A GRPO ATZ EGYETLEN GRUP: ", groups)
        for (let i = 0; i < groups.length; i++) {
            let groupsWithStudents = {
                group : groups[i],
                students: await studentRepository.getStudentsByGroupID(groups[i].ID)
            } 
            //console.log("itt van ez a cunyó: ",groupsWithStudents)
            groupsWithStudentsArray.push(groupsWithStudents)
        }

        //console.log("VÉGRE ITT VAGYOK A TÖMBNÉK JUHUUUU: ", groupsWithStudentsArray)
        return groupsWithStudentsArray

    }

    async CreatedGroup(newGroup){
        console.log("OOOOO: ", newGroup)
        const usersExist = await UserService.checkIfUsersExist(newGroup.StudentOMIDs)
        if(!usersExist){
            console.log("SZAAAAAR : ", usersExist)
            return -1 
        }
        else if(usersExist)
        {
            console.log("PERSZE EZ JÓ ELVÉGRE : ", usersExist)
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
        console.log("AZ ELSŐ N ÁTMENT ")
        const userNotInGroup = await userService.checkIfUsersAlreadyInGroup(newGroup.StudentOMIDs)
        console.log("vissza jótt és ez egy : ", userNotInGroup)
        if(userNotInGroup){
            return -2
        }
        console.log("))))))))))))))))))): ", newGroup)
        for (let i = 0; i < newGroup.StudentOMIDs.length; i++) {
            // await studentGroupRepository.createStudentGroup
            const student = await studentRepository.getStudentByOmId(newGroup.StudentOMIDs[i])
            console.log("MEGTALÁLTAM : ", student)
            const newStudentGroup = {
                GroupID: newGroup.id,
                StudentID: student.ID
            }
            await studentGroupRepository.createStudentGroup(newStudentGroup);
        }
        console.log("VAN ILYEN MINDEN JÓ ")
        return "sikerült"
    }

    
}
module.exports = new adminService(); 