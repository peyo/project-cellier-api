const knex = require("knex");
const app = require("../src/app");
const TestScents = require("./data/test-scents");
const TestRatings = require("./data/test-ratings");
const TestGroups = require("./data/test-groups");
const TestUsers = require("./data/test-users");
const supertest = require("supertest");
const { expect } = require("chai");
const helpers = require("./test-helpers/test-helpers");

describe(`Ratings endpoints`, function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  before(() => {
    return db.raw(
      "TRUNCATE TABLE users, groups, scents, ratings RESTART IDENTITY CASCADE"
    );
  });

  afterEach(() => {
    return db.raw(
      "TRUNCATE TABLE users, groups, scents, ratings RESTART IDENTITY CASCADE"
    );
  });

  after(() => {
    return db.destroy();
  });

  context(`Given "ratings" has data.`, () => {
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

    it(`GET /api/ratings responds with 200 and all the ratings`, () => {
      return supertest(app).get("/api/ratings").expect(200, TestRatings);
    });

    it(`GET /api/ratings/:id responds with 200 and the specified rating`, () => {
      const id = 2;
      const expected = TestRatings[id - 1];
      return supertest(app)
        .get(`/api/ratings/${id}`)
        .expect(200, JSON.stringify(expected));
    });

    it(`POST /api/ratings responds 401 'Unauthorized request' when invalid password`, () => {
      const userInvalidPass = {
        username: TestUsers[0].username,
        password: "wrong",
      };
      return supertest(app)
        .post("/api/ratings")
        .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`POST /api/ratings creates a rating, responding with 201 and the new rating`, () => {
      this.retries(3);
      const newRating = {
        scents_id: 1,
        rating: 1,
        date_created: new Date(),
        date_edited: new Date(),
      };

      return supertest(app)
        .post("/api/ratings")
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .send(newRating)
        .expect(201)
        .expect((res) => {
          expect(res.body.scents_id).to.eql(newRating.scents_id);
          expect(res.body.rating).to.eql(newRating.rating);
          expect(res.body.users_id).to.eql(TestUser.users_id);

          const actualDate = new Date(res.body.date_created).toLocaleString();
          const expectedDate = new Date().toLocaleString();
          expect(actualDate).to.eql(expectedDate);

          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/ratings/${res.body.id}`);
        })
        .expect((res) =>
          db
            .from("ratings")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.scents_id).to.eql(newRating.scents_id);
              expect(row.rating).to.eql(newRating.rating);
              expect(row.users_id).to.eql(TestUser.users_id);

              const actualDate = new Date(row.date_created).toLocaleString();
              const expectedDate = new Date().toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });

    it(`POST /api/ratings responds with 400 and an error message when the rating is missing`, () => {
      return supertest(app)
        .post("/api/ratings")
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .send({
          scents_id: 1,
          date_created: new Date(),
        })
        .expect(400, {
          error: {
            message: `Missing "rating" in request body.`,
          },
        });
    });

    it(`PATCH /api/ratings/:id responds with 204 and updates the rating`, () => {
      const id = 2;
      const updatedRating = {
        rating: 1,
        date_created: "2029-01-22T16:28:32.615Z",
        date_edited: "2029-01-22T16:28:32.615Z",
      };
      const expected = {
        ...TestRatings[id - 1],
        ...updatedRating,
      };
      return supertest(app)
        .patch(`/api/ratings/${id}`)
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .send(updatedRating)
        .expect(204)
        .then((res) =>
          supertest(app).get(`/api/ratings/${id}`).expect(expected)
        );
    });

    it(`PATCH /api/ratings/:id responds with 400 when no required fields are supplied`, () => {
      const id = 2;
      return supertest(app)
        .patch(`/api/ratings/${id}`)
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .send({ irrelevant: `100` })
        .expect(400, {
          error: {
            message: `Request body must contain rating.`,
          },
        });
    });
  });

  context(`Given "ratings" has no data.`, () => {
    it(`GET /api/ratings/:id responds with 404`, () => {
      const id = 123456;
      return supertest(app)
        .get(`/api/ratings/${id}`)
        .expect(404, {
          error: {
            message: `Rating doesn't exist.`,
          },
        });
    });

    it(`PATCH /api/ratings/:id responds with 404`, () => {
      const id = 123456;
      return supertest(app)
        .patch(`/api/ratings/${id}`)
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .expect(404, {
          error: {
            message: `Rating doesn't exist.`,
          },
        });
    });
  });

  context(`Protected endpoints`, () => {
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

    it(`POST /api/ratings responds with 401 "Missing basic token" when no basic token is used`, () => {
      return supertest(app)
        .post(`/api/ratings`)
        .expect(401, {
          error: {
            message: `Missing basic token.`,
          },
        });
    });

    it(`POST /api/ratings responds 401 "Unauthorized request" when no credentials in token`, () => {
      const userNoCreds = { user_name: "", password: "" };
      return supertest(app)
        .post(`/api/ratings`)
        .set("Authorization", helpers.makeAuthHeader(userNoCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`POST /api/ratings responds 401 "Unauthorized request" when invalid user`, () => {
      const userInvalidCreds = { username: "user-not", password: "exist" };
      return supertest(app)
        .post(`/api/ratings`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`POST /api/ratings responds 401 "Unauthorized request" when invalid password`, () => {
      const userInvalidPass = {
        username: TestUsers[0].username,
        password: "wrong",
      };
      return supertest(app)
        .post(`/api/ratings`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`PATCH /api/ratings/:id responds with 401 "Missing basic token" when no basic token is used`, () => {
      return supertest(app)
        .patch(`/api/ratings/1`)
        .expect(401, {
          error: {
            message: `Missing basic token.`,
          },
        });
    });

    it(`PATCH /api/ratings/:id responds 401 "Unauthorized request" when no credentials in token`, () => {
      const userNoCreds = { user_name: "", password: "" };
      return supertest(app)
        .patch(`/api/ratings/1`)
        .set("Authorization", helpers.makeAuthHeader(userNoCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`PATCH /api/ratings/:id responds 401 "Unauthorized request" when invalid user`, () => {
      const userInvalidCreds = { username: "user-not", password: "exist" };
      return supertest(app)
        .patch(`/api/ratings/1`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`PATCH /api/ratings/:id responds 401 "Unauthorized request" when invalid password`, () => {
      const userInvalidPass = {
        username: TestUsers[0].username,
        password: "wrong",
      };
      return supertest(app)
        .patch(`/api/ratings/1`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });
  });
});
