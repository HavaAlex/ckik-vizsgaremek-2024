const request = require("supertest");
const app = require("../app"); 

const userRepository = require("../api/repositories/userRepository");
const teacherRepository = require("../api/repositories/teacherRepository");
const studentRepository= require("../api/repositories/studentRepository");
const groupRepository= require("../api/repositories/groupRepository");
const studentGroupRepository= require("../api/repositories/studentGroupRepository");
const assignmentRepository = require("../api/repositories/assignmentRepository");
const jwt = require("jsonwebtoken");
const { get } = require("lodash");
jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

describe("Hazifeladatok tesztelése",()=>{
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
    let goodtestAssignment; //egy olyan ami müködik, teszteljük vele a többi funkciót is 
    describe("Tanári oldal tesztelése",()=>{
        
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
                //console.log("rezponze: ",uploadres)
                expect(uploadres.status).toBe(200)
                expect(uploadres.body.teacherID).toBe(teacher1.ID)

                goodtestAssignment = uploadres.body
                
                
            })
        })

        describe("GET hazikGroups",()=>{
            test("should return groups",async()=>{
                const allGroups = await request(app)
                .get("/feladat/hazikGroups")
                .set(setUserHeader())
                expect(Array.isArray(allGroups.body)).toBe(true)
                expect(allGroups.body[0].ID).toBe(newGroup1.ID)
                expect(allGroups.body[0].name).toBe(newGroup1.name)
            })
        })

        describe("GET haziktanar",()=>{ //korábban már töltötünk fel sikeresen ezért azzal most nem foglalkozunk
            test("Visszadja a tanárnak a feladatait az arra érkezett válaszokkal együtt.",async()=>{
                const sentAssignemnts = await request(app)
                .get("/feladat/haziktanar")
                .set(setUserHeader())

                expect(Array.isArray(sentAssignemnts.body)).toBe(true)
                expect(sentAssignemnts.body[0]).toHaveProperty("feladat")
                expect(sentAssignemnts.body[0]).toHaveProperty("anwsers")
                expect(sentAssignemnts.body[0].feladat.teacherID).toBe(teacher1.ID)
                expect(sentAssignemnts.body[0].anwsers.length).toBe(2)
            })
        })
        
        describe("POST uploadassignmentFiles",()=>{
            test("sikeresen feltölti az új feladatohoz a file-t", async ()=>{
                
            const response = await request(app)
            .post('/feladat/uploadassignmentfiles')
            .attach("files", Buffer.from("Dummy file content"), "testfile.txt")
            .field("assignmentId", "1")
            .set(setUserHeader())
            expect(response.status).toBe(200);
            expect(response.body.nagycucc.message).toBe("Files uploaded successfully")
            expect(Array.isArray(response.body.nagycucc.uploadedFiles)).toBe(true)
            })
        })

        describe("GET getassignmentFiles",  ()=>{
            test("sikeresen lekéri a file-okat egy adott feladathoz annak ID-ja alapján",async()=>{
                const response = await request(app)
                .get("/feladat/getAssignmentFiles/").set("assignmentid", 1).set(setUserHeader())
                
                expect(response.body.length).toBe(1)
                expect(response.body[0].ID).toBe(1)
                expect(response.body[0].assignmentID).toBe(goodtestAssignment.ID)
                
            })
        })

        describe("DELETE /feladat/deleteAssignment/",()=>{
            test("Sikeres törlés esetén rövidebb a tömb hossza",async()=>{
                const uploadres2 = await request(app)
                .post("/feladat/newassignment")
                .set(setUserHeader())
                .send({
                  Groups:[{ID: newGroup1.ID, name: "13.c", studentList:[newStudent1.ID, newStudent2.ID]}],
                  Description:"test2"
                  ,DeadLine:"2026-12-12",
                  UploadDate:"2020-05-01"
                });

                const uploadres3 = await request(app)
                .post("/feladat/newassignment")
                .set(setUserHeader())
                .send({
                  Groups:[{ID: newGroup1.ID, name: "13.c", studentList:[newStudent1.ID, newStudent2.ID]}],
                  Description:"test3"
                  ,DeadLine:"2026-12-12",
                  UploadDate:"2020-05-01"
                });


                let sentAssignemnts = await request(app)
                .get("/feladat/haziktanar")
                .set(setUserHeader())

                const assignmentId = sentAssignemnts.body[2].feladat.ID

                const lengthBeforeDelete = sentAssignemnts.body.length
                const deleteRes = await request(app).delete(`/feladat/deleteAssignment/${assignmentId}`).set("Authorization", `Bearer ${token}`);
                expect(deleteRes.status).toBe(201)
                expect(deleteRes.body).toBe("sikerült")
                sentAssignemnts = await request(app)
                .get("/feladat/haziktanar")
                .set(setUserHeader())
                const lengthAfterDelete = sentAssignemnts.body.length
                expect(lengthBeforeDelete-1).toBe(lengthAfterDelete)

            })
        })

        

    })
    describe("Diák oldal tesztelése",()=>{
        beforeAll(async()=>{
            token = jwt.sign({ userData:user2 }, process.env.JWT_KEY, { expiresIn: "20m" });
            setUserHeader = () => ({
                authorization: `Bearer ${token}`
            });
        })
        /describe("GET /feladat/hazikdiak",()=>{
            test("Leszedi egy tömbben a diák házifeladatait. Mindegyikben van egy valasz és egy feladat object", async ()=>{
                const receivedAssignemnts = await request(app)
                .get("/feladat/hazikdiak")
                .set(setUserHeader())
                expect(receivedAssignemnts.status).toBe(201)
                expect(receivedAssignemnts.body[0]).toHaveProperty("valasz")
                expect(receivedAssignemnts.body[0]).toHaveProperty("feladat")
                expect(receivedAssignemnts.body[0].valasz.studentID).toBe(newStudent2.ID)
                expect(receivedAssignemnts.body[0].feladat.teacherID).toBe(teacher1.ID)
                expect(receivedAssignemnts.body[0].valasz.status).toBe("Nincs leadva")
            })
        })
        describe("PATCH /feladat/modifycompletedassignment",()=>{
            test("módosítás megtörténik sikeresen",async()=>{
                const modifiedCompletedAssignment = await request(app)
                .patch("/feladat/modifycompletedassignment")
                .set(setUserHeader()).send({
                    ID:2,
                    assignmentID: goodtestAssignment.ID,
                    date: Date.now(),
                    status: "Nincs leadva",
                    studentID: newStudent2.ID,
                    textAnswer: "TestValasz"
                  });

                expect(modifiedCompletedAssignment.body.assignmentID).toBe(goodtestAssignment.ID)
                expect(modifiedCompletedAssignment.body.status).toBe("Leadva")
                expect(modifiedCompletedAssignment.body.textAnswer).toBe("TestValasz")


            })
        })

        describe("POST uploadCompletedAssignmentFiles",()=>{
            test("feltölti az összes fájlt egy válaszhoz a megfelelő módon",async ()=>{
                const response = await request(app)
                .post('/feladat/uploadcompletedassignmentfiles')
                .attach("files", Buffer.from("Dummy file content"), "testfile.txt")
                .attach("files", Buffer.from("Dummy file content2"), "testfile2.txt")
                .field("completedAssignmentId", "2")
                .set(setUserHeader())
                expect(response.status).toBe(200);
                expect(response.body.nagycucc.message).toBe('Files uploaded successfully');
                expect(Array.isArray(response.body.nagycucc.uploadedFiles)).toBe(true)
                expect(response.body.nagycucc.uploadedFiles.length).toBe(2)
                })
        })

        describe("POST getCompletedAssignmentFiles",()=>{
            test("lekéri a 2-es id-jú válasz 2 fájlját", async ()=>{
                const getRes = await request(app)
                .post("/feladat/getCompletedAssignmentFiles/").send([2]).set("Authorization", `Bearer ${token}`);
                expect(getRes.status).toBe(201)
                expect(getRes.body[0].length).toBe(2)
            })
        })
         describe("DELETE deleteCompletedAssignmentFile",()=>{
            test("Sikeresen kitöröl egy Válasz fájlt", async ()=>{
                const getRes = await request(app)
                .post("/feladat/getCompletedAssignmentFiles/").send([2]).set("Authorization", `Bearer ${token}`);
                expect(getRes.status).toBe(201)
                expect(getRes.body[0].length).toBe(2)
                const fileId = getRes.body[0][0].ID
                const deleteRes = await request(app).delete(`/feladat/deleteAnswerFile/${fileId}`).set("Authorization", `Bearer ${token}`);
                expect(deleteRes.status).toBe(201)
                expect(deleteRes.body).toBe("sikerült")

                const getRes2 = await request(app)
                .post("/feladat/getCompletedAssignmentFiles/").send([2]).set("Authorization", `Bearer ${token}`);
                expect(getRes.status).toBe(201)
                expect(getRes.body[0].length).toBe(2)
                expect((getRes.body[0].length)-1).toBe(getRes2.body[0].length)
            })
        })
    })
})