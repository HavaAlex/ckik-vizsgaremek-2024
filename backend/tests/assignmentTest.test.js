const request = require("supertest");
const app = require("../app"); 

const userRepository = require("../api/repositories/userRepository");
const teacherRepository = require("../api/repositories/teacherRepository");
const studentRepository= require("../api/repositories/studentRepository");
const groupRepository= require("../api/repositories/groupRepository");
const studentGroupRepository= require("../api/repositories/studentGroupRepository");
const assignmentRepository = require("../api/repositories/assignmentRepository");
const jwt = require("jsonwebtoken");
jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

describe("Hazifeladatok tesztelése",()=>{
    describe("Tanári oldal tesztelése",()=>{
        let user1, user2, user3,teacher1, newStudent1,newStudent2,newGroup1,newStudentGroups1,newStudentGroups2,token;
        beforeAll(async()=>{
            await require("../__mocks__/db").sequelize.sync({ force: true });
            user1 = { ID: 1, username: "Uborka Ubul", password: "pass", role: "tanar" };
            user2 = { ID: 2, username: "Turó Teréz", password: "pass", role: "diak" };
            user3 = { ID: 3, username: "Pöttyös Peti", password: "pass", role: "diak" };

            teacher1 =
            {
                ID: 1,
                name:"Uborka Ubul",
                phone:"+234",
                email:"dsa@email.hu",
                userId: 1
            };
            newStudent1 =
            {
                ID: 1,
                name:"Turó Teréz",
                DoB: "2000-01-01",
                address:"Cegléd Ló utca 28",
                phone:"+366",
                email:"kreativemailcim2@email.hu",
                userId: 2,
                OMID:"1234",
                
            };
            newStudent2 =
            {
                ID: 2,
                name:"Pöttyös Peti",
                DoB: "2000-01-01",
                address:"Cegléd Ló utca 28",
                phone:"+366",
                email:"kreativemailcim2@email.hu",
                userId: 3,
                OMID:"324",
            };
            newGroup1 =
            {
                ID:1,
                name:"13.C"
            }
            newStudentGroups1 = 
            {
                GroupID:1,
                StudentID:1,
            }
            newStudentGroups2 =
            {
                GroupID:1,
                StudentID:2,
            }

            token = jwt.sign({ userData:user1 }, process.env.JWT_KEY, { expiresIn: "20m" });

            await userRepository.createUser(user1);
            await teacherRepository.createTeacher(teacher1);
            
            await userRepository.createUser(user2);
            await studentRepository.createStudent(newStudent1);
            
            await userRepository.createUser(user3);
            await studentRepository.createStudent(newStudent2);
            await groupRepository.createGroup(newGroup1);
            await studentGroupRepository.createStudentGroup(newStudentGroups1);
            await studentGroupRepository.createStudentGroup(newStudentGroups2);
        })
        const setUserHeader = () => ({
            authorization: `Bearer ${token}`
        });
        describe("POST newAssignment",()=>{
            test("Should return Nincs határidő megadva",async ()=>{
                const uploadres = await request(app)
                .post("/feladat/newassignment")
                .set(setUserHeader())
                .send({
                  Groups:[ {ID: newGroup1.ID, name: "13.c", studentList:[newStudent1.ID, newStudent2.ID]}],
                  Description:"test"
                  ,DeadLine:"",
                  UploadDate:"2020-05-01"
                });
                console.log("ÁÁÁ ", uploadres)
                //const getres = await assignmentRepository.getAssignmentByID(uploadres.ID)
                expect(uploadres.text).toBe("Nincs határidő megadva")
                expect(uploadres.status).toBe(500)
            })
            test("Should return Nincs csoport megadva",async ()=>{
                const uploadres = await request(app)
                .post("/feladat/newassignment")
                .set(setUserHeader())
                .send({
                  Groups:[],
                  Description:"test"
                  ,DeadLine:"2030-12-12",
                  UploadDate:"2020-05-01"
                });

                //const getres = await assignmentRepository.getAssignmentByID(uploadres.ID)
                expect(uploadres.text).toBe("Nincs csoport megadva")
                expect(uploadres.status).toBe(500)
            })
            test("Should return Nem athad meg eleve lejárt határidőt",async ()=>{
                const uploadres = await request(app)
                .post("/feladat/newassignment")
                .set(setUserHeader())
                .send({
                  Groups:[{ID: newGroup1.ID, name: "13.c", studentList:[newStudent1.ID, newStudent2.ID]}],
                  Description:"test"
                  ,DeadLine:"1848-12-12",
                  UploadDate:"2020-05-01"
                });

                //const getres = await assignmentRepository.getAssignmentByID(uploadres.ID)
                expect(uploadres.text).toBe("Nem athad meg eleve lejárt határidőt")
                expect(uploadres.status).toBe(500)
            })

            test("Should return Nincs megadva leírás",async ()=>{
                const uploadres = await request(app)
                .post("/feladat/newassignment")
                .set(setUserHeader())
                .send({
                  Groups:[{ID: newGroup1.ID, name: "13.c", studentList:[newStudent1.ID, newStudent2.ID]}],
                  Description:""
                  ,DeadLine:"2500-12-12",
                  UploadDate:"2020-05-01"
                });

                //const getres = await assignmentRepository.getAssignmentByID(uploadres.ID)
                expect(uploadres.text).toBe("Nincs megadva leírás")
                expect(uploadres.status).toBe(500)
            })

            test("Should return New AssignmentData",async ()=>{
                const uploadres = await request(app)
                .post("/feladat/newassignment")
                .set(setUserHeader())
                .send({
                  Groups:[{ID: newGroup1.ID, name: "13.c", studentList:[newStudent1.ID, newStudent2.ID]}],
                  Description:"test"
                  ,DeadLine:"2026-12-12",
                  UploadDate:"2020-05-01"
                });

                //const getres = await assignmentRepository.getAssignmentByID(uploadres.ID)
                console.log("rezponze: ",uploadres)
                expect(uploadres.status).toBe(200)
            })

            console.log("LEFUTR A TESZT")
        })

    })
    /*describe("Diák oldal tesztelése",()=>{
        beforeAll(async()=>{
            
        })
    })*/
    console.log("LEFUTR A TESZT")
})