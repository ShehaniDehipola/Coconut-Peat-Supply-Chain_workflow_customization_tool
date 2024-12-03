(async () => {
  const chai = await require("../chai-wrapper.cjs");
  const { expect } = chai;

  const sinon = require("sinon");
  const sinonMongoose = require("sinon-mongoose");
  const User = require("../models/User");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const { registerUser, loginUser } = require("../controllers/userController");
  const httpMocks = require("node-mocks-http");

  // Unit test for registerUser function
  describe("User Controller - Register User", () => {
    afterEach(() => {
      sinon.restore();
    });

    it("should register a new user successfully", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          username: "testuser",
          email: "testuser@example.com",
          password: "password123",
          role: "user",
        },
      });
      const res = httpMocks.createResponse();

      const saveStub = sinon.stub(User.prototype, "save").resolves();

      sinon
        .stub(User, "findOne")
        .withArgs({ email: "testuser@example.com" })
        .resolves(null);

      await registerUser(req, res);

      expect(res.statusCode).to.equal(201);
      const data = res._getJSONData();
      expect(data.message).to.equal("User registered successfully");

      saveStub.restore();
    });

    it("should return error if user already exists", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          email: "testuser@example.com",
        },
      });
      const res = httpMocks.createResponse();

      sinon
        .stub(User, "findOne")
        .withArgs({ email: "testuser@example.com" })
        .resolves({});

      await registerUser(req, res);

      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.message).to.equal("User already exists");
    });
  });
})();
