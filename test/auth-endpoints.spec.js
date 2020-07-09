const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers/test-helpers");
const TestUsers = require("./data/test-users");

describe("Auth Endpoints", function () {
  let db;

  const testUser = TestUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after(() => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  context(`Given "users" has data.`, () => {
    beforeEach(() => {
      return db.into("users").insert(TestUsers);
    });

    const requiredFields = ["username", "password"];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };

      it(`POST /api/auth/login responds with 400 required error when "${field}" is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post("/api/auth/login")
          .send(loginAttemptBody)
          .expect(400, {
            error: {
              message: `Missing "${field}" in request body.`,
            },
          });
      });
    });

    it(`POST /api/auth/login responds 400 "invalid username or password" when bad username`, () => {
      const userInvalidUser = { username: "user-not", password: "existy" };
      return supertest(app)
        .post("/api/auth/login")
        .send(userInvalidUser)
        .expect(400, {
          error: {
            message: `Incorrect username or password.`,
          },
        });
    });

    it(`POST /api/auth/login responds 400 "invalid username or password" when bad password`, () => {
      const userInvalidPass = {
        username: testUser.username,
        password: "incorrect",
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(userInvalidPass)
        .expect(400, {
          error: {
            message: `Incorrect username or password.`,
          },
        });
    });

    it(`POST /api/auth/login responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        username: testUser.username,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { users_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: "HS256",
        }
      );
      return supertest(app)
        .post("/api/auth/login")
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });
  });
});
