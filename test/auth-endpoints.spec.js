const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers/test-helpers");
const TestUsers = require("./data/test-users");

describe.only("Auth Endpoints", function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  const testUser = TestUsers[0];

  before(() => helpers.cleanTables(db));

  afterEach(() => helpers.cleanTables(db));

  after(() => {
    return db.destroy();
  });

  context(`Given "users" has data.`, () => {
    beforeEach(() => {
      return db.into("users").insert(TestUsers);
    });

    it(`POST /api/auth/login responds 200 and JWT auth token using secret when credentials are valid`, () => {
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
  });
});
