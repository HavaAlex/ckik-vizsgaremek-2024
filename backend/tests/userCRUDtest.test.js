jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

const userRepository = require("../api/repositories/userRepository");
const studentRepository= require("../api/repositories/studentRepository");
const groupRepository= require("../api/repositories/groupRepository");
const studentGroupRepository= require("../api/repositories/studentGroupRepository");
const teacherRepository = require("../api/repositories/teacherRepository");
const GuardianStudentRepository = require("../api/repositories/guardianStudentRepository")
const GuardianRepository = require("../api/repositories/guardianRepository")

describe("userCRUDtest", ()=>{
    beforeAll( async () => 
    {
        await require("../__mocks__/db").sequelize.sync({ force: true });
    });
    
})