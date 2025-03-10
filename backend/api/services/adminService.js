const adminRepository = require("../repositories/adminRepository");
const teacherRepository = require("../repositories/teacherRepository");
const TeacherRepository = require("../repositories/teacherRepository")
const UserRepository = require("../repositories/userRepository")

const bcrypt = require("bcrypt");
const salt = 10;

class adminService {
    async uploadTeachers(teachers){
        const uploadedTeachers = [];
        for (let i = 0; i < teachers.length; i++) {
            console.log("ŰŰŰŰŰŰŰŰŰŰŰŰ ", teachers[i])
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
            console.log("xy hülye fasz: ",newUser)
            const user = await UserRepository.getUser(newUser.username)
            console.log("usre: ", user);
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
}
module.exports = new adminService(); 