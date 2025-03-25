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

// If you later decide to test group-related functionality, import the group repository as needed.
// const groupRepository = require("../api/repositories/groupRepository");

jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

describe("Üzenet funkciók tesztelése", () => {
  let user1, user2, user3,user4,user5,teacher1,teacher2,teacher3, newStudent1,newStudent2,newGroup1,newStudentGroups1,newStudentGroups2,token;

  beforeAll(async () => {
    // Sync the in-memory (mock) database
    await require("../__mocks__/db").sequelize.sync({ force: true });

    // Create some users that will act as sender and receivers
    
    user1 = { ID: 1, username: "sender", password: "pass", role: "tanar" };
    user2 = { ID: 2, username: "receiver1", password: "pass", role: "tanar" };
    user3 = { ID: 3, username: "receiver2", password: "pass", role: "tanar" };

    user4 = { ID: 4, username: "student1", password: "pass", role: "diak" };
    user5 = { ID: 5, username: "student2", password: "pass", role: "diak" };

    teacher1 =
    {
        ID: 1,
        name:"sender",
        phone:"+123",
        email:"dsaasd@email.hu",
        userId: 1
    };
    teacher2 =
    {
        ID: 2,
        name:"receiver1",
        phone:"+234",
        email:"dsa@email.hu",
        userId: 2
    };
    teacher3 =
    {
        ID: 3,
        name:"receiver2",
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
    //console.log(process.env.JWT_KEY)
    
    await userRepository.createUser(user1);
    await teacherRepository.createTeacher(teacher1);
    
    await userRepository.createUser(user2);
    await teacherRepository.createTeacher(teacher2);
    
    await userRepository.createUser(user3);
    await teacherRepository.createTeacher(teacher3);

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
  describe("POST ", () => {
    test("Hibát dob ha üres az üzenet", async () => {
      const res = await request(app)
        .post("/uzenet")
        .set(setUserHeader())
        .send({
          message: "",
          date: "2000-01-01",
          receiverlist: [{ ID: user2.ID }],
          receiverGrouplist: []
        });

      expect(res.status).toBe(500);
      expect(res.text).toMatch(/Szöveg nélkül nem lehet üzenetet küldeni!/);
    });

    test("Hibát dob a nincsenek célpontjai az üzenetnek", async () => {
      const res = await request(app)
        .post("/uzenet")
        .set(setUserHeader())
        .send({
          message: "Test üzenet",
          date: "2000-01-01",
          receiverlist: [],
          receiverGrouplist: []
        });

      expect(res.status).toBe(500);
      expect(res.text).toMatch(/Címzettek nélkül nem lehet üzenetet küldeni!/);
    });

    test("Új üzenet sikeres feltöltése egy usernek", async () => {
      const res = await request(app)
        .post("/uzenet")
        .set(setUserHeader())
        .send({
          message: "Test üzenet",
          date: "2000-01-01",
          receiverlist: [{ ID: user2.ID }],
          receiverGrouplist: []
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("ID");
      expect(res.body.senderUserID).toBe(user1.ID);
      expect(res.body.message).toBe("Test üzenet");
      const eredmeny = await messageReceiverRepository.getMessageReceiverByMessageID(res.body.ID)
      expect(eredmeny[0].UserID).toBe(user2.ID)
      
      const eredemeny2 = await messageReceiverRepository.getMessageReceiverByUserID(user2.ID)
      expect(eredemeny2[0].MessageID).toBe(res.body.ID)
    });

    test("Új üzenet sikeres feltöltése egy csoportnak", async () => {
      const res = await request(app)
        .post("/uzenet")
        .set(setUserHeader())
        .send({
          message: "Test üzenet2",
          date: "2000-01-01",
          receiverlist: [],
          receiverGrouplist: [{ID: newGroup1.ID, studentList: [newStudent1.userId, newStudent2.userId] }]
        });
  
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("ID");
      expect(res.body.senderUserID).toBe(user1.ID);
      expect(res.body.message).toBe("Test üzenet2");
      const messagereceiverData = await messageReceiverRepository.getMessageReceiverByMessageID(res.body.ID)
      expect(messagereceiverData[0].UserID).toBe(user4.ID)
      expect(messagereceiverData[1].UserID).toBe(user5.ID)
    });
  });


  describe("GET messages", () => {
    test("Lekéri a user üzeneteit", async () => {
      const res = await request(app)
        .get("/uzenet")
        .set(setUserHeader());

      expect(res.status).toBe(201);
      // Expect an array or object based on your implementation
      expect(Array.isArray(res.body.kapott)).toBe(true);
      expect(Array.isArray(res.body.elkuldott)).toBe(true);
    });
  });

  describe("GET potentialReceivers", () => {
    test("Leszedi az elérhető címzettet (kivéve önmagát)", async () => {
      const res = await request(app)
        .get("/uzenet/uzenetekreceivers")
        .set(setUserHeader());

      expect(res.status).toBe(201);
      //megvan e minden része
      expect(res.body).toHaveProperty("singleUsers");
      expect(res.body).toHaveProperty("groups");
      expect(Array.isArray(res.body.singleUsers)).toBe(true);
      expect(Array.isArray(res.body.groups)).toBe(true);
    });
  });


});