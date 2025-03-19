jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

const markRepository = require("../api/repositories/markRepository");
const userRepository = require("../api/repositories/userRepository");
const studentRepository= require("../api/repositories/studentRepository");
const groupRepository= require("../api/repositories/groupRepository");
const studentGroupRepository= require("../api/repositories/studentGroupRepository");
const teacherRepository = require("../api/repositories/teacherRepository");

describe("getGroupMarksTest", () =>
{
    beforeAll( async () => 
    {
        await require("../__mocks__/db").sequelize.sync({ force: true });
    });

    describe("GetGroupMarks", () => 
    {

        beforeAll( async () => 
        {
            const newUser1 =
            {
                ID: 1,
                username:"laci",
                password:"maci",
                role:"diak",
            };
            const newStudent1 =
            {
                ID: 1,
                name:"Mászlealóról László",
                DoB: Date.now(),
                address:"Cegléd Ló utca 27",
                phone:"+36",
                email:"kreativemailcim@email.hu",
                OMID:"123",
                userId: 1
            };

            const newUser2 =
            {
                ID: 2,
                username:"kaki",
                password:"maki",
                role:"diak",
            };
            const newStudent2 =
            {
                ID: 2,
                name:"Károly Mátyás",
                DoB: Date.now(),
                address:"Cegléd Ló utca 28",
                phone:"+366",
                email:"kreativemailcim2@email.hu",
                OMID:"1234",
                userId: 2
            };

            const newUser3 =
            {
                ID: 3,
                username:"tanar",
                password:"tanar",
                role:"tanar",
            };
            const newTeacher1 =
            {
                ID: 1,
                name:"Tótin Lóránt",
                phone:"+36543984",
                email:"kreativemailcim4@email.hu",
                userId: 3
            };

            const newMark1 =
            {
                ID: 1,
                teacherID: 1,
                studentID:1,
                Value:5,
                Multiplier:100,
                date:Date.now(),
                subjectName:"Majom programozás",
            };

            const newMark2 =
            {
                ID: 2,
                teacherID: 1,
                studentID:2,
                Value:3,
                Multiplier:100,
                date:Date.now(),
                subjectName:"Majom programozás",
            };

            const newGroup1 =
            {
                ID:1,
                name:"13.C"
            }
            const newGroup2 =
            {
                ID:2,
                name:"12.C"
            }

            const newStudentGroups1 = //igen direkt van felváltva
            {
                GroupID:1,
                StudentID:2,
            }
            const newStudentGroups2 =
            {
                GroupID:2,
                StudentID:1,
            }

            await userRepository.createUser(newUser1);
            await userRepository.createUser(newUser2);
            await userRepository.createUser(newUser3);
            await studentRepository.createStudent(newStudent1);
            await studentRepository.createStudent(newStudent2);
            await teacherRepository.createTeacher(newTeacher1);
            await groupRepository.createGroup(newGroup1);
            await groupRepository.createGroup(newGroup2);
            await studentGroupRepository.createStudentGroup(newStudentGroups1);
            await studentGroupRepository.createStudentGroup(newStudentGroups2);
            await markRepository.createMark(newMark1);
            await markRepository.createMark(newMark2);
        });

        test("GetMarksByGroup vissza ad length 1", async () => 
        {
            const eredmeny = await markRepository.getMarksByGroup(2)
            console.log(eredmeny)
            expect(eredmeny.length).toBe( 1);
        });

        test("GetMarksByGroup vissza adja az 1-es id-vel rendelkező jegyet", async () => 
        {
            const eredmeny = await markRepository.getMarksByGroup(2)
            console.log(eredmeny)
            expect(eredmeny[0]).toHaveProperty("ID", 1);
        });
    })
})