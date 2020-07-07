const knex = require("knex");
const app = require("../src/app");
const TestScents = require("./data/test-scents");
const TestRatings = require("./data/test-ratings");
const TestGroups = require("./data/test-groups");
const TestUsers = require("./data/test-users");
const supertest = require("supertest");

describe(`Groups endpoints`, function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  before(() => {
    return db.raw("TRUNCATE TABLE users, groups, scents, comments, ratings CASCADE");
  });

  afterEach(() => {
    return db.raw("TRUNCATE TABLE users, groups, scents, comments, ratings CASCADE");
  });

  after(() => {
    return db.destroy();
  });

  context(`Given "groups" has data.`, () => {
    beforeEach(() => {
      return db.into("users").insert(TestUsers);
    });
    
    beforeEach(() => {
      return db.into("groups").insert(TestGroups);
    });

    beforeEach(() => {
      return db.into("scents").insert(TestScents);
    });

    beforeEach(() => {
      return db.into("ratings").insert(TestRatings);
    });

    it(`GET /api/groups responds with 200 and all the groups`, () => {
      return supertest(app)
        .get("/api/groups")
        .expect(200, TestGroups);
    });

    it(`GET /api/groups/:id responds with 200 and the specified group`, () => {
      const id = 2;
      const expected = TestGroups[id - 1];
      return supertest(app)
        .get(`/api/groups/${id}`)
        .expect(200, expected)
    });
  });

  context(`Given "groups" has no data.`, () => {
    it("GET /api/groups responds with 200 and an empty list", () => {
      return supertest(app)
        .get("/api/groups")
        .expect(200, [])
    });

    it(`GET /api/groups/:id responds with 404`, () => {
      const id = 123456;
      return supertest(app)
        .get(`/api/groups/${id}`)
        .expect(404, { error: `Group doesn't exist.` })
    });
  });
});
