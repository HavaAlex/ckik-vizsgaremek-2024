const GroupRepository = require("../repositories/groupRepository");

class GroupService
{
    async getTeacherGroups(teacherID)
    {
        return await GroupRepository.getTeacherGroups(teacherID);
    }

    async createGroup()
    {
        return await GroupRepository.createGroup();
    }

    async getGroup(studentID) {
        return await GroupRepository.getGroup(studentID)
    }
}

module.exports = new GroupService();