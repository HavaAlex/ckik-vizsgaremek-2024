//const adminRepository = require("../repositories/adminRepository");
const teacherRepository = require("../repositories/teacherRepository");
const studentRepository = require("../repositories/studentRepository")
const UserRepository = require("../repositories/userRepository")
const GuardianStudentRepository = require("../repositories/guardianStudentRepository")
const GuardianRepository = require("../repositories/guardianRepository")

const bcrypt = require("bcrypt");
const salt = 10;

class adminService {
    async uploadTeachers(teachers){
        const uploadedTeachers = [];
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
            console.log("ŰŰŰŰŰŰŰŰŰŰŰŰ ", students[i])
            const username = await UserRepository.createUserName(students[i].name)
            const passwordUncrypted = await UserRepository.generatePassword()
            // Create new user object with the given attributes.
            const newUser = {
                id: null,
                username: username,
                password: await bcrypt.hash(passwordUncrypted, salt),
                role: "diak"
            };
            
            await UserRepository.createUser(newUser);
            newUser.password = passwordUncrypted;
            console.log("xy hülye fasz: ",newUser)
            const user = await UserRepository.getUser(newUser.username)
            console.log("usre: ", user);
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
        console.log("cucccccok: ",guardians)
        for (let i = 0; i < guardians.length; i++) {
            console.log("ŰŰŰŰŰŰŰŰŰŰŰŰ ", guardians[i])
            const username = await UserRepository.createUserName(guardians[i].name)
            console.log("kigenerált username: ", username)
            const passwordUncrypted = await UserRepository.generatePassword()
            console.log("kigenerált jelszó: ", passwordUncrypted)
            // Create new user object with the given attributes.
            const newUser = {
                id: null,
                username: username,
                password: await bcrypt.hash(passwordUncrypted, salt),
                role: "szulo"
            };
            
            await UserRepository.createUser(newUser);
            newUser.password = passwordUncrypted;
            console.log("xy hülye fasz: ",newUser)
            const user = await UserRepository.getUser(newUser.username)
            console.log("usre: ", user);
            uploadedStudents.push(newUser);
            let newGuardian = {
                id: null,
                name: newUser.username, //van egy .address is majd megcsináljuk
                phone: guardians[i].phone,
                email: guardians[i].email,
                userId: user.ID
            }
            newGuardian = await GuardianRepository.createGuardian(newGuardian)
            console.log("AZ imént megcsinált szulo: ", newGuardian)
            for (let j = 0; j < guardians[i].RelatedStudents.length; j++) {
                console.log("ez alapján keresünk: ",guardians[i].RelatedStudents[j])
                const StudentID = await studentRepository.getStudentByOmId(guardians[i].RelatedStudents[j])
                console.log("megtaláltik genyao: ", StudentID)
                const newGuardianStudent = {
                    GuardianID:newGuardian.ID,
                    StudentID: StudentID.ID
                }
                await GuardianStudentRepository.createGuardianStudent(newGuardianStudent)
                
            }
        }

        return uploadedStudents
    }



}
module.exports = new adminService(); 