const groupRepository = require("../repositories/groupRepository");
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

    async getGroupsOfStudent(studentID) {
        return await GroupRepository.getGroupsOfStudent(studentID)
    }

    async checkIfGroupNameIsNotTaken(name){
        console.log("őt hasonlítjuk: ", name)
        const groups = await groupRepository.getAllGroups();
        for (let i = 0; i < groups.length; i++) {
            console.log("Van ilyen: ", groups[i].dataValues.name)
            if(groups[i].dataValues.name == name){

                return false
            }
            
        }
        return true
    }
}

module.exports = new GroupService();