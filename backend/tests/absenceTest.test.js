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
const app = require("../app"); // adjust the path to where your Express app is exported
const lessonRepository = require("../api/repositories/lessonRepository");
const absenceRepository = require("../api/repositories/absenceRepository");

describe("Absence Test", () =>
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
    let newTeacher1;
    let newGroup1;
    let newGroup2;
    let newStudentGroups1;
    let newStudentGroups2;
    let newAbsence1;
    let newAbsence2;
    let newAbsence3;
    let newAbsence4_rossz;
    let newLesson1;
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
        role:"diak",
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
        name:"Tótin Lóránt",
        phone:"+36543984",
        email:"kreativemailcim4@email.hu",
        userId: 3
    };

    newAbsence1 = {
        ID: 1,
        teacherID: 1,
        studentID: 1,
        lessonID: 1,
        date: "2025-03-24T09:10:46.626Z",
        excused: false,
    };
    
    newAbsence2 = {
        ID: 2,
        teacherID: 1,
        studentID: 1,
        lessonID: 1,
        date: "2025-03-25T10:15:30.000Z",
        excused: false,
    };
    
    newAbsence3 = {
        ID: 3,
        teacherID: 1,
        studentID: 2,
        lessonID: 1,
        date: "2025-03-26T08:00:00.000Z",
        excused: false,
    };
    
    newAbsence4_rossz = {
        ID: "rossz",
        teacherID: 1,
        lessonID: 1,
        date: "2025-03-27T11:45:00.000Z",
        excused: false,
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
        StudentID:2,
    }
    newStudentGroups2 =
    {
        GroupID:2,
        StudentID:1,
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

    beforeAll( async () => 
    {
        await require("../__mocks__/db").sequelize.sync({ force: true });
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
        await lessonRepository.createLesson(newLesson1)
        await absenceRepository.createAbsence(newAbsence1);
        await absenceRepository.createAbsence(newAbsence2);
        await absenceRepository.createAbsence(newAbsence3);

        token_newUser1 = jwt.sign({ userData:newUser1 }, process.env.JWT_KEY, { expiresIn: "20m" });
        token_newUser2 = jwt.sign({ userData:newUser2 }, process.env.JWT_KEY, { expiresIn: "20m" });
        token_newUser3 = jwt.sign({ userData:newUser3 }, process.env.JWT_KEY, { expiresIn: "20m" });
        token_newUser4 = jwt.sign({ userData:newUser4 }, process.env.JWT_KEY, { expiresIn: "20m" });
        
    });

    describe("Absence controller get test", () => 
    {
        const setUserHeader = (token) => ({
            authorization: `Bearer ${token}`
        });

        test("GetAbsences vissza adja e a megfelelő hányzásokat (1-es ID diák lekéri a hiányzásait)", async () => 
        {
            const res = await request(app)
                .get("/hianyzas")
                .set(setUserHeader(token_newUser1))
            console.log(res.body)
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(2)
            expect(res.body[0]).toStrictEqual(newAbsence1);
            expect(res.body[1]).toStrictEqual(newAbsence2);
        });

        test("GetAbsences vissza adja e a megfelelő hányzásokat (2-es ID diák lekéri a hiányzásait)", async () => 
        {
            const res = await request(app)
                .get("/hianyzas")
                .set(setUserHeader(token_newUser2))
            console.log(res.body)
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(1)
            expect(res.body[0]).toStrictEqual(newAbsence3);
        });
    })
    describe("Absence controller post test", () => 
        {
            const setUserHeader = (token) => ({
                authorization: `Bearer ${token}`
            });
    
    
            test("Sikeres hiányzás feltöltés", async () => 
                {
                    const res = await request(app)
                        .post("/hianyzas/postAbsence")
                        .set(setUserHeader(token_newUser3))
                        .send(newAbsence3)
                    expect(res.status).toBe(201);
                    expect(res.body).toBeInstanceOf(Object);
                    console.log(res.body)
                    expect(res.body.ID).toBe(newAbsence3.ID);
                    expect(res.body.excused).toBe(newAbsence3.excused);
                    expect(res.body.studentID).toBe(newAbsence3.studentID);
                    expect(res.body.subjectName).toBe(newAbsence3.subjectName);
                    expect(res.body.teacherID).toBe(newAbsence3.teacherID);
                });
            test("Sikertelen hiányzás feltöltés", async () => 
                {
                    const res = await request(app)
                        .post("/hianyzas/postAbsence")
                        .set(setUserHeader(token_newUser3))
                        .send(newAbsence4_rossz)
                    expect(res.status).toBe(500);
                });
        })
})