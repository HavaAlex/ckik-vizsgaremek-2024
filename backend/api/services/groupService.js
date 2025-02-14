const GroupRepository = require("../repositories/groupRepository");

class GroupService
{
    async getTeacherGroups(teacherID)
    {
        return await GroupRepository.getTeacherGroups(teacherID);
    }
}

module.exports = new GroupService();