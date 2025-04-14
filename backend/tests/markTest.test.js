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

describe("Mark Test", () =>
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
    let newMark1;
    let newMark2;
    let newMark3;
    let newMark4_rossz;
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
        name:"Kakadú Zoltán",
        phone:"+36543984",
        email:"kreativemailcim4@email.hu",
        userId: 3
    };

    newMark1 =
    {
        ID: 1,
        teacherID: 1,
        studentID:1,
        Value:5,
        Multiplier:100,
        date:"2025-03-24T09:10:46.626Z",
        subjectName:"Majom programozás",
    };
    newMark2 =
    {
        ID: 2,
        teacherID: 1,
        studentID:2,
        Value:3,
        Multiplier:100,
        date:"2025-03-24T09:10:46.626Z",
        subjectName:"Majom programozás",
    };
    newMark3 =
    {
        ID: 3,
        teacherID: 1,
        studentID:2,
        Value:1,
        Multiplier:200,
        date:"2025-03-24T09:10:46.626Z",
        subjectName:"Matematika",
    };
    newMark4_rossz =
    {
        ID: 3,
        teacherID: 4,
        studentID:2,
        Multiplier:200,
        date:"2025-03-24T09:10:46.626Z",
        subjectName:"Matematika",
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
        ID:null,
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
        await markRepository.createMark(newMark1);
        await markRepository.createMark(newMark2);
        await lessonRepository.createLesson(newLesson1)

        token_newUser1 = jwt.sign({ userData:newUser1 }, process.env.JWT_KEY, { expiresIn: "20m" });
        token_newUser2 = jwt.sign({ userData:newUser2 }, process.env.JWT_KEY, { expiresIn: "20m" });
        token_newUser3 = jwt.sign({ userData:newUser3 }, process.env.JWT_KEY, { expiresIn: "20m" });
        token_newUser4 = jwt.sign({ userData:newUser4 }, process.env.JWT_KEY, { expiresIn: "20m" });
            
    });

    describe("Mark controller get test", () => 
    {
        const setUserHeader = (token) => ({
            authorization: `Bearer ${token}`
        });

        test("GetJegyek vissza adja e a megfelelő jegyet (1-es ID diák lekéri a jegyeit)", async () => 
        {
            const res = await request(app)
                .get("/jegy")
                .set(setUserHeader(token_newUser1))
            expect(res.status).toBe(201);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toStrictEqual(newMark1);
        });

        test("GetTanarJegyek vissza adja e a megfelelő jegyet (1-es ID tanár lekéri a jegyeit)", async () => 
        {
            const res = await request(app)
                .get("/jegy/csoportjegy")
                .set(setUserHeader(token_newUser3))
            expect(res.status).toBe(201);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body).toStrictEqual([{"groupName": "13.C", "marks": [[{"ID": 2, "Multiplier": 100, "Student": {"name": "Károly Mátyás"}, "Value": 3, "date": "2025-03-24T09:10:46.626Z", "studentID": 2, "subjectName": "Majom programozás", "teacherID": 1}]], "tantargyak": ["Majom programozás"]}]);
        });
    })
    describe("Mark controller post test", () => 
        {
            const setUserHeader = (token) => ({
                authorization: `Bearer ${token}`
            });
    
    
            test("Sikeres jegy feltöltés", async () => 
                {
                    const res = await request(app)
                        .post("/jegy")
                        .set(setUserHeader(token_newUser3))
                        .send(newMark3)
                    expect(res.status).toBe(201);
                    expect(res.body).toBeInstanceOf(Object);
                    expect(res.body.ID).toBe(newMark3.ID);
                    expect(res.body.Multiplier).toBe(newMark3.Multiplier);
                    expect(res.body.Value).toBe(newMark3.Value);
                    expect(res.body.studentID).toBe(newMark3.studentID);
                    expect(res.body.subjectName).toBe(newMark3.subjectName);
                    expect(res.body.teacherID).toBe(newMark3.teacherID);
                });
            test("Sikertelen jegy feltöltés", async () => 
                {
                    const res = await request(app)
                        .post("/jegy")
                        .set(setUserHeader(token_newUser3))
                        .send(newMark4_rossz)
                    expect(res.status).toBe(500);
                });
        })
})