jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

const markRepository = require("../api/repositories/markRepository");
const userRepository = require("../api/repositories/userRepository");
const studentRepository= require("../api/repositories/studentRepository");
const groupRepository= require("../api/repositories/groupRepository");
const studentGroupRepository= require("../api/repositories/studentGroupRepository");
const teacherRepository = require("../api/repositories/teacherRepository");
const jegyController = require("../api/controllers/jegyController")
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../app");
const lessonRepository = require("../api/repositories/lessonRepository");
const guardianRepository = require("../api/repositories/guardianRepository");

describe("Timetable test", () =>
{
    let token_newUser1;
    let token_newUser2;
    let token_newUser3;
    let token_newUser4;
    let newUser1;
    let newUser2;
    let newUser3;
    let newUser4;
    let newStudent1;
    let newStudent2;
    let newSzulo1;
    let newTeacher1;
    let newGroup1;
    let newGroup2;
    let newStudentGroups1;
    let newStudentGroups2;
    let newLesson1;
    let newLesson2;
    newUser1 =
    {
        ID: 1,
        username:"laci",
        password:"maci",
        role:"diak",
    };
    newStudent1 =
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

    newUser2 =
    {
        ID: 2,
        username:"jaci",
        password:"maki",
        role:"diak",
    };
    newUser4 =
    {
        ID: 4,
        username:"taci",
        password:"maki",
        role:"szulo",
    };
    newStudent2 =
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
    newSzulo1 =
    {
        ID: 2,
        name:"Károly Mátyás",
        DoB: Date.now(),
        address:"Cegléd Ló utca 28",
        phone:"+366",
        email:"kreativemailcim2@email.hu",
        OMID:"1234",
        userId: 4
    };

    newUser3 =
    {
        ID: 3,
        username:"tanar",
        password:"tanar",
        role:"tanar",
    };
    newTeacher1 =
    {
        ID: 1,
        name:"Kakadú Zoltán",
        phone:"+36543984",
        email:"kreativemailcim4@email.hu",
        userId: 3
    };

    newGroup1 =
    {
        ID:1,
        name:"13.C"
    }
    newGroup2 =
    {
        ID:2,
        name:"12.C"
    }


    newStudentGroups1 =
    {
        GroupID:1,
        StudentID:1,
    }
    newStudentGroups2 =
    {
        GroupID:2,
        StudentID:2,
    }
    newLesson1 =
    {
        ID:1,
        groupID:1,
        teacherID:1,
        start_Hour:'5',
        start_Minute:'10',
        length:'45',
        day:'hetfo',
        subjectName:"Majom Programozás"
    }
    newLesson2 =
    {
        ID:2,
        groupID:2,
        teacherID:1,
        start_Hour:'6',
        start_Minute:'11',
        length:'50',
        day:'kedd',
        subjectName:"Majom Programozás csak menőbb"
    }
    beforeAll( async () => 
    {
        await require("../__mocks__/db").sequelize.sync({ force: true });
    });

    describe("Timetable controller get test", () => 
    {
        const setUserHeader = (token) => ({
            authorization: `Bearer ${token}`
        });
        beforeAll( async () => 
        {

            await userRepository.createUser(newUser1);
            await userRepository.createUser(newUser2);
            await userRepository.createUser(newUser3);
            await userRepository.createUser(newUser4);
            await studentRepository.createStudent(newStudent1);
            await studentRepository.createStudent(newStudent2);
            await teacherRepository.createTeacher(newTeacher1);
            await guardianRepository.createGuardian(newSzulo1);
            await groupRepository.createGroup(newGroup1);
            await groupRepository.createGroup(newGroup2);
            await studentGroupRepository.createStudentGroup(newStudentGroups1);
            await studentGroupRepository.createStudentGroup(newStudentGroups2);
            await lessonRepository.createLesson(newLesson1)
            await lessonRepository.createLesson(newLesson2)

            token_newUser1 = jwt.sign({ userData:newUser1 }, process.env.JWT_KEY, { expiresIn: "20m" });
            token_newUser2 = jwt.sign({ userData:newUser2 }, process.env.JWT_KEY, { expiresIn: "20m" });
            token_newUser3 = jwt.sign({ userData:newUser3 }, process.env.JWT_KEY, { expiresIn: "20m" });
            token_newUser4 = jwt.sign({ userData:newUser4 }, process.env.JWT_KEY, { expiresIn: "20m" });
            //console.log(process.env.JWT_KEY)
        });

        test("GetOrarend vissza adja e a megfelelő órákat (1-es ID diák lekéri az óráit)", async () => 
        {
            const res = await request(app)
                .get("/orarend")
                .set(setUserHeader(token_newUser1))
            //console.log(res.body)
            expect(res.status).toBe(201);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toStrictEqual({
                ID: 1,
                groupID: 1,
                teacherID: 1,
                start_Hour: 5,
                start_Minute: 10,
                length: 45,
                day: 'hetfo',
                subjectName: 'Majom Programozás',
                Teacher: {
                    name: "Kakadú Zoltán",
                },
                excused: false
            });
        });
        test("GetOrarend vissza adja e a megfelelő órákat (2-es ID diák lekéri az óráit)", async () => 
        {
            const res = await request(app)
                .get("/orarend")
                .set(setUserHeader(token_newUser2))
            //console.log(res.body)
            expect(res.status).toBe(201);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toStrictEqual({
                ID:2,
                groupID:2,
                teacherID:1,
                start_Hour:6,
                start_Minute:11,
                length:50,
                day:'kedd',
                subjectName:"Majom Programozás csak menőbb",
                excused: false,
                Teacher: {
                    name: "Kakadú Zoltán",
                },
            });
        });
        test("GetOrarend vissza adja e a megfelelő órákat (1-es ID tanár lekéri az óráit)", async () => 
            {
                const res = await request(app)
                    .get("/orarend")
                    .set(setUserHeader(token_newUser3))
                //console.log(res.body)
                expect(res.status).toBe(201);
                expect(res.body).toBeInstanceOf(Array);
                expect(res.body[1]).toStrictEqual({
                    ID:2,
                    groupID:2,
                    teacherID:1,
                    start_Hour:6,
                    start_Minute:11,
                    length:50,
                    day:'kedd',
                    subjectName:"Majom Programozás csak menőbb",
                    excused: false,
                    Teacher: {
                        name: "Kakadú Zoltán",
                    },
                });
            });
        test("GetTantargyak vissza adja e a megfelelő tantárgyakat (1-es ID tanár lekéri a tantrágyait)", async () => 
        {
            const res = await request(app)
                .get("/tanar/tantargy")
                .set(setUserHeader(token_newUser3))
            //console.log(res.body)
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body).toEqual([{subjectName:'Majom Programozás'},{subjectName:"Majom Programozás csak menőbb"}]);
        });
    })
})