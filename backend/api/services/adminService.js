const adminRepository = require("../repositories/adminRepository");

class adminService {
    async uploadTeachers(teachers){
        return await adminRepository.uploadTeachers(teachers);
    }
}
module.exports = new adminService(); 