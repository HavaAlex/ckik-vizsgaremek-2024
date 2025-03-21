const request = require("supertest");
const app = require("../app"); // adjust the path to where your Express app is exported
const uzenetService = require("../api/services/uzenetService");
const userRepository = require("../api/repositories/userRepository");
const teacherRepository = require("../api/repositories/teacherRepository");
const studentRepository= require("../api/repositories/studentRepository");
const groupRepository= require("../api/repositories/groupRepository");
const studentGroupRepository= require("../api/repositories/studentGroupRepository");
const messageReceiverRepository = require("../api/repositories/messageReceiverRepository")
const MessageRepository = require("../api/repositories/messageRepository")
const jwt = require("jsonwebtoken");
const adminRepository = require("../api/repositories/adminRepository");

// If you later decide to test group-related functionality, import the group repository as needed.
// const groupRepository = require("../api/repositories/groupRepository");

jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

describe("Üzenet funkciók tesztelése", () => {
    let user1, user2, user3,user4,user5,admin,teacher1,teacher2, newStudent1,newStudent2,newGroup1,newStudentGroups1,newStudentGroups2,token;

  beforeAll(async () => {
    // Sync the in-memory (mock) database
    await require("../__mocks__/db").sequelize.sync({ force: true });

    // Create some users that will act as sender and receivers
    
    user1 = { ID: 1, username: "rendszergazda", password: "pass", role: "admin" };
    user2 = { ID: 2, username: "karcsiba", password: "pass", role: "tanar" };
    user3 = { ID: 3, username: "akosba", password: "pass", role: "tanar" };
    user4 = { ID: 4, username: "student1", password: "pass", role: "diak" };
    user5 = { ID: 5, username: "student2", password: "pass", role: "diak" };
    admin =
    {
        ID: 1,
        name:"admin",
        phone:"+123",
        email:"dsaasd@email.hu",
        userId: 1
    };
    teacher1 =
    {
        ID: 2,
        name:"karcsiba",
        phone:"+234",
        email:"dsa@email.hu",
        userId: 2
    };
    teacher2 =
    {
        ID: 3,
        name:"karcsiba",
        phone:"+345",
        email:"asd@email.hu",
        userId: 3
    };
    newStudent1 =
    {
        ID: 1,
        name:"student1",
        DoB: "2000-01-01",
        address:"Cegléd Ló utca 28",
        phone:"+366",
        email:"kreativemailcim2@email.hu",
        userId: 4,
        OMID:"1234",
        
    };
    newStudent2 =
    {
        ID: 2,
        name:"student2",
        DoB: "2000-01-01",
        address:"Cegléd Ló utca 28",
        phone:"+366",
        email:"kreativemailcim2@email.hu",
        userId: 5,
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
        StudentID:2,
    }
    newStudentGroups2 =
    {
        GroupID:1,
        StudentID:1,
    }


    token = jwt.sign({ userData:user1 }, process.env.JWT_KEY, { expiresIn: "20m" });
    console.log(process.env.JWT_KEY)
    console.log("Ő az: ", user1)
    console.log("megkapja ami jár: ", token)
    await userRepository.createUser(user1);
    await adminRepository.createAdmin(admin);
    
    await userRepository.createUser(user2);
    await teacherRepository.createTeacher(teacher1);
    
    await userRepository.createUser(user3);
    await teacherRepository.createTeacher(teacher2);

    await userRepository.createUser(user4);
    await studentRepository.createStudent(newStudent1);
    await userRepository.createUser(user5);
    await studentRepository.createStudent(newStudent2);

    await groupRepository.createGroup(newGroup1);
    await studentGroupRepository.createStudentGroup(newStudentGroups1);
    await studentGroupRepository.createStudentGroup(newStudentGroups2);
    
    
    
  });

    // Helper to set the decoded user (simulate authentication)
    const setUserHeader = () => ({
            authorization: `Bearer ${token}`
    });
    test("pp",()=>{
        console.log("UUU")
        expect(2+2).toBe(5)
    })

      //Admin lekérdezések
    describe("GET allMessages", () => {
        test("should return all messages", async () => {

            //új üzenet először hogy legyen mit nézni
            const createRes = await request(app)
            .post("/uzenet")
            .set(setUserHeader())
            .send({
            message: "Message to delete",
            date: "2000-01-01",
            receiverlist: [{ ID: user2.ID }],
            receiverGrouplist: []
            });

            expect(createRes.status).toBe(201);


        const res = await request(app)
            .get("/admin/allMessage").set("Authorization", `Bearer ${token}`);;

        expect(res.status).toBe(201);
        
        expect(res.body).toBeDefined();
        expect(res.body).toHaveLength(1)
        });
    });

    describe("DELETE /admin/deleteMessage/:ID", () => {
        test("should delete a message by its ID", async () => {
        // First, create a message that we can delete
        const createRes = await request(app)
            .post("/uzenet")
            .set(setUserHeader())
            .send({
            message: "Message to delete",
            date: "2000-01-01",
            receiverlist: [{ ID: user2.ID }],
            receiverGrouplist: []
            });

        expect(createRes.status).toBe(201);
        const messageID = createRes.body.ID;
            
        // Now, delete the message
        const deleteRes = await request(app)
            .delete(`/admin/deleteMessage/${messageID}`).set("Authorization", `Bearer ${token}`);;

        expect(deleteRes.status).toBe(201);
        // Assuming your deleteMessage returns an object indicating success, e.g., { success: true }
        expect(deleteRes.body).toBe("Sikeres törlés")
        });
    });

});
