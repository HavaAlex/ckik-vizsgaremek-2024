const request = require("supertest");
const app = require("../app"); // adjust the path to where your Express app is exported
const uzenetService = require("../api/services/uzenetService");
const userRepository = require("../api/repositories/userRepository");
const jwt = require("jsonwebtoken");

// If you later decide to test group-related functionality, import the group repository as needed.
// const groupRepository = require("../api/repositories/groupRepository");

jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

describe("Üzenet funkciók tesztelése", () => {
  let sender, receiver1, receiver2, token;

  beforeAll(async () => {
    // Sync the in-memory (mock) database
    await require("../__mocks__/db").sequelize.sync({ force: true });

    // Create some users that will act as sender and receivers
    sender = { ID: 10, username: "sender", password: "pass", role: "user" };
    receiver1 = { ID: 11, username: "receiver1", password: "pass", role: "user" };
    receiver2 = { ID: 12, username: "receiver2", password: "pass", role: "user" };
    token = jwt.sign({ sender }, process.env.JWT_KEY, { expiresIn: "20m" });
    console.log(process.env.JWT_KEY)

    await userRepository.createUser(sender);
    await userRepository.createUser(receiver1);
    await userRepository.createUser(receiver2);
  });

  // Helper to set the decoded user (simulate authentication)
  const setUserHeader = () => ({
          authorization: `Bearer ${token}`
      });

  describe("POST ", () => {
    test("should fail when message is empty", async () => {
      const res = await request(app)
        .post("/uzenet")
        .set(setUserHeader())
        .send({
          message: "",
          date: "2000-01-01",
          receiverlist: [{ ID: receiver1.ID }],
          receiverGrouplist: []
        });

      expect(res.status).toBe(500);
      expect(res.text).toMatch(/Szöveg nélkül nem lehet üzenetet küldeni!/);
    });

    test("should fail when no recipients are provided", async () => {
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

    test("should create a new message successfully", async () => {
      const res = await request(app)
        .post("/uzenet")
        .set(setUserHeader())
        .send({
          message: "Test üzenet",
          date: "2000-01-01",
          receiverlist: [{ ID: receiver1.ID }],
          receiverGrouplist: []
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("ID");
      expect(res.body.senderUserID).toBe(sender.ID);
      expect(res.body.message).toBe("Test üzenet");
    });
  });

  describe("GET /api/v1/uzenetek", () => {
    test("should return messages for the authenticated user", async () => {
      const res = await request(app)
        .get("/uzenet")
        .set(setUserHeader());

      expect(res.status).toBe(201);
      // Expect an array or object based on your implementation
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/v1/potentialReceivers", () => {
    test("should return potential receivers", async () => {
      const res = await request(app)
        .get("/uzenet/uzenetekreceivers")
        .set(setUserHeader());

      expect(res.status).toBe(201);
      // Assuming the returned object contains a "singleUsers" key
      expect(res.body).toHaveProperty("singleUsers");
    });
  });

  describe("GET /api/v1/allMessages", () => {
    test("should return all messages", async () => {
      const res = await request(app)
        .get("/uzenet/all");

      expect(res.status).toBe(201);
      // Check that the response body is defined (further checks can be added)
      expect(res.body).toBeDefined();
    });
  });

  describe("DELETE /api/v1/message/:ID", () => {
    test("should delete a message by its ID", async () => {
      // First, create a message that we can delete
      const createRes = await request(app)
        .post("/uzenet")
        .set(setUserHeader())
        .send({
          message: "Message to delete",
          date: "2000-01-01",
          receiverlist: [{ ID: receiver1.ID }],
          receiverGrouplist: []
        });

      expect(createRes.status).toBe(201);
      const messageID = createRes.body.ID;

      // Now, delete the message
      const deleteRes = await request(app)
        .delete(`deleteMessage/${messageID}`);

      expect(deleteRes.status).toBe(201);
      // Assuming your deleteMessage returns an object indicating success, e.g., { success: true }
      expect(deleteRes.body).toHaveProperty("success", true);
    });
  });
});
