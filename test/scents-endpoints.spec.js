const knex = require("knex");
const app = require("../src/app");
const TestScents = require("./data/test-scents");
const TestRatings = require("./data/test-ratings");
const TestGroups = require("./data/test-groups");
const supertest = require("supertest");

describe(`Scents endpoints`, function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  before(() => {
    return db.raw("TRUNCATE TABLE groups, scents, comments, ratings CASCADE");
  });

  afterEach(() => {
    return db.raw("TRUNCATE TABLE groups, scents, comments, ratings CASCADE");
  });

  after(() => {
    return db.destroy();
  });

  context(`Given "scents" has data.`, () => {
    beforeEach(() => {
      return db.into("groups").insert(TestGroups);
    });

    beforeEach(() => {
      return db.into("scents").insert(TestScents);
    });

    beforeEach(() => {
      return db.into("ratings").insert(TestRatings);
    });

    it(`GET /api/scents responds with 200 and all the scents`, () => {
      return supertest(app)
        .get("/api/scents")
        .expect(200, TestScents);
    });

    it(`GET /api/scents/:id responds with 200 and the specified scent`, () => {
      const id = 2;
      const expected = TestScents[id - 1];
      return supertest(app)
        .get(`/api/scents/${id}`)
        .expect(200, expected)
    });

    it(`GET /api/scents/:id/ratings responds with 200 and the specified scent rating`, () => {
      const id = 1;
      const expected = {
        scents_id: id,
        scent_avg: JSON.stringify(4.5)
      }
      return supertest(app)
        .get(`/api/scents/${id}/ratings`)
        .expect(200, expected)
    });
  });

  context(`Given "scents" has no data.`, () => {
    it("GET /api/scents responds with 200 and an empty list", () => {
      return supertest(app)
        .get("/api/scents")
        .expect(200, [])
    });

    it(`GET /api/scents/:id responds with 404`, () => {
      const id = 123456;
      return supertest(app)
        .get(`/api/scents/${id}`)
        .expect(404, { error: `Scent doesn't exist.` })
    });
  });
});
