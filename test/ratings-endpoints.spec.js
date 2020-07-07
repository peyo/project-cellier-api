const knex = require("knex");
const app = require("../src/app");
const TestScents = require("./data/test-scents");
const TestRatings = require("./data/test-ratings");
const TestGroups = require("./data/test-groups");
const TestUsers = require("./data/test-users");
const supertest = require("supertest");
const { expect } = require("chai");

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
    return db.raw("TRUNCATE TABLE users, groups, scents, ratings RESTART IDENTITY CASCADE");
  });

  afterEach(() => {
    return db.raw("TRUNCATE TABLE users, groups, scents, ratings RESTART IDENTITY CASCADE");
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
      return supertest(app)
        .get("/api/ratings")
        .expect(200, TestRatings);
    });

    it(`GET /api/ratings/:id responds with 200 and the specified rating`, () => {
      const id = 2;
      const expected = TestRatings[id - 1];
      return supertest(app)
        .get(`/api/ratings/${id}`)
        .expect(200, JSON.stringify(expected));
    });

    it(`POST /api/ratings creates a rating, responding with 201 and the new rating`, () => {
      this.retries(3);
      const newRating = {
        scents_id: 1,
        rating: 1,
        users_id: 3,
        date_created: new Date(),
        date_edited: new Date(),
      };

      return supertest(app)
        .post("/api/ratings")
        .send(newRating)
        .expect(201)
        .expect((res) => {
          expect(res.body.scents_id).to.eql(newRating.scents_id);
          expect(res.body.rating).to.eql(newRating.rating);
          expect(res.body.users_id).to.eql(newRating.users_id);

          const actualDate = new Date(res.body.date_created).toLocaleString();
          const expectedDate = new Date().toLocaleString();
          expect(actualDate).to.eql(expectedDate);

          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/ratings/${res.body.id}`);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/ratings/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });

    it(`POST /api/ratings responds with 400 and an error message when the rating is missing`, () => {
      return supertest(app)
        .post("/api/ratings")
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
        .expect(404, {
          error: {
            message: `Rating doesn't exist.`,
          },
        });
    });
  });
});
