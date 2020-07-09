const knex = require("knex");
const app = require("../src/app");
const TestScents = require("./data/test-scents");
const TestComments = require("./data/test-comments");
const TestGroups = require("./data/test-groups");
const TestUsers = require("./data/test-users");
const supertest = require("supertest");
const { expect } = require("chai");
const helpers = require("./test-helpers/test-helpers");

describe(`Comments endpoints`, function () {
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
      "TRUNCATE TABLE users, groups, scents, comments RESTART IDENTITY CASCADE"
    );
  });

  afterEach(() => {
    return db.raw(
      "TRUNCATE TABLE users, groups, scents, comments RESTART IDENTITY CASCADE"
    );
  });

  after(() => {
    return db.destroy();
  });

  context(`Given "comments" has data.`, () => {
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
      return db.into("comments").insert(TestComments);
    });

    it(`GET /api/comments responds with 200 and all the comments`, () => {
      return supertest(app).get("/api/comments").expect(200, TestComments);
    });

    it(`GET /api/comments/:id responds with 200 and the specified comment`, () => {
      const id = 2;
      const expected = TestComments[id - 1];
      return supertest(app)
        .get(`/api/comments/${id}`)
        .expect(200, JSON.stringify(expected));
    });

    it(`POST /api/comments responds 401 'Unauthorized request' when invalid password`, () => {
      const userInvalidPass = {
        username: TestUsers[0].username,
        password: "wrong",
      };
      return supertest(app)
        .post("/api/comments")
        .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    // POST is working in Postman but not working as a test. Pretty curious scenario.
    it(`POST /api/comments creates a comment, responding with 201 and the new comment`, () => {
      this.retries(3);
      const newComment = {
        scents_id: 1,
        comment: "Enriching...",
        date_created: new Date(),
        date_edited: new Date(),
      };

      return supertest(app)
        .post("/api/comments")
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .send(newComment)
        .expect(201)
        .expect((res) => {
          expect(res.body.scents_id).to.eql(newComment.scents_id);
          expect(res.body.comment).to.eql(newComment.comment);
          expect(res.body.users_id).to.eql(TestUser.users_id);

          const actualDate = new Date(res.body.date_created).toLocaleString();
          const expectedDate = new Date().toLocaleString();
          expect(actualDate).to.eql(expectedDate);

          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`);
        })
        .expect((res) =>
          db
            .from("comments")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.scents_id).to.eql(newComment.scents_id);
              expect(row.comment).to.eql(newComment.comment);
              expect(row.users_id).to.eql(TestUser.users_id);

              const actualDate = new Date(row.date_created).toLocaleString('en', { timeZone: 'UTC' });
              const expectedDate = new Date().toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });

    it(`POST /api/comments responds with 400 and an error message when the comment is missing`, () => {
      return supertest(app)
        .post("/api/comments")
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .send({
          scents_id: 1,
          date_created: new Date(),
        })
        .expect(400, {
          error: {
            message: `Missing "comment" in request body.`,
          },
        });
    });

    it(`DELETE /api/comments/:id responds with 204 and removes the comment`, () => {
      const id = 2;
      const expected = [
        {
          id: 1,
          scents_id: 1,
          comment: "Smells soothing!",
          users_id: 1,
          date_created: "2029-01-22T16:28:32.615Z",
          date_edited: "2029-01-22T16:28:32.615Z",
        },
      ];

      return supertest(app)
        .delete(`/api/comments/${id}`)
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .expect(204)
        .then((res) => supertest(app).get("/api/comments").expect(expected));
    });

    it(`PATCH /api/comments/:id responds with 204 and updates the comment`, () => {
      const id = 2;
      const updatedComment = {
        comment: "Elevating!",
        date_created: "2029-01-22T16:28:32.615Z",
        date_edited: "2029-01-22T16:28:32.615Z",
      };
      const expected = {
        ...TestComments[id - 1],
        ...updatedComment,
      };
      return supertest(app)
        .patch(`/api/comments/${id}`)
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .send(updatedComment)
        .expect(204)
        .then((res) =>
          supertest(app).get(`/api/comments/${id}`).expect(expected)
        );
    });

    it(`PATCH /api/comments/:id responds with 400 when no required fields are supplied`, () => {
      const id = 2;
      return supertest(app)
        .patch(`/api/comments/${id}`)
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .send({ irrelevant: `YOOO!` })
        .expect(400, {
          error: {
            message: `Request body must contain comment.`,
          },
        });
    });
  });

  context(`Given "comments" has no data.`, () => {
    it(`GET /api/comments/:id responds with 404`, () => {
      const id = 123456;
      return supertest(app)
        .get(`/api/comments/${id}`)
        .expect(404, {
          error: {
            message: `Comment doesn't exist.`,
          },
        });
    });

    it(`DELETE /api/comments/:id responds with 404`, () => {
      const id = 123456;
      return supertest(app)
        .delete(`/api/comments/${id}`)
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .expect(404, {
          error: {
            message: `Comment doesn't exist.`,
          },
        });
    });

    it(`PATCH /api/comments/:id responds with 404`, () => {
      const id = 123456;
      return supertest(app)
        .patch(`/api/comments/${id}`)
        .set("Authorization", helpers.makeAuthHeader(TestUsers[0]))
        .expect(404, {
          error: {
            message: `Comment doesn't exist.`,
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
      return db.into("comments").insert(TestComments);
    });

    it(`POST /api/comments responds with 401 "Missing basic token" when no basic token is used`, () => {
      return supertest(app)
        .post(`/api/comments`)
        .expect(401, {
          error: {
            message: `Missing basic token.`,
          },
        });
    });

    it(`POST /api/comments responds 401 "Unauthorized request" when no credentials in token`, () => {
      const userNoCreds = { user_name: "", password: "" };
      return supertest(app)
        .post(`/api/comments`)
        .set("Authorization", helpers.makeAuthHeader(userNoCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`POST /api/comments responds 401 "Unauthorized request" when invalid user`, () => {
      const userInvalidCreds = { username: "user-not", password: "exist" };
      return supertest(app)
        .post(`/api/comments`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`POST /api/comments responds 401 "Unauthorized request" when invalid password`, () => {
      const userInvalidPass = {
        username: TestUsers[0].username,
        password: "wrong",
      };
      return supertest(app)
        .post(`/api/comments`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`DELETE /api/comments/:id responds with 401 "Missing basic token" when no basic token is used`, () => {
      return supertest(app)
        .delete(`/api/comments/1`)
        .expect(401, {
          error: {
            message: `Missing basic token.`,
          },
        });
    });

    it(`DELETE /api/comments/:id responds 401 "Unauthorized request" when no credentials in token`, () => {
      const userNoCreds = { user_name: "", password: "" };
      return supertest(app)
        .delete(`/api/comments/1`)
        .set("Authorization", helpers.makeAuthHeader(userNoCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`DELETE /api/comments/:id responds 401 "Unauthorized request" when invalid user`, () => {
      const userInvalidCreds = { username: "user-not", password: "exist" };
      return supertest(app)
        .delete(`/api/comments/1`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`DELETE /api/comments/:id responds 401 "Unauthorized request" when invalid password`, () => {
      const userInvalidPass = {
        username: TestUsers[0].username,
        password: "wrong",
      };
      return supertest(app)
        .delete(`/api/comments/1`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`PATCH /api/comments/:id responds with 401 "Missing basic token" when no basic token is used`, () => {
      return supertest(app)
        .patch(`/api/comments/1`)
        .expect(401, {
          error: {
            message: `Missing basic token.`,
          },
        });
    });

    it(`PATCH /api/comments/:id responds 401 "Unauthorized request" when no credentials in token`, () => {
      const userNoCreds = { user_name: "", password: "" };
      return supertest(app)
        .patch(`/api/comments/1`)
        .set("Authorization", helpers.makeAuthHeader(userNoCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`PATCH /api/comments/:id responds 401 "Unauthorized request" when invalid user`, () => {
      const userInvalidCreds = { username: "user-not", password: "exist" };
      return supertest(app)
        .patch(`/api/comments/1`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidCreds))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });

    it(`PATCH /api/comments/:id responds 401 "Unauthorized request" when invalid password`, () => {
      const userInvalidPass = {
        username: TestUsers[0].username,
        password: "wrong",
      };
      return supertest(app)
        .patch(`/api/comments/1`)
        .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
        .expect(401, {
          error: {
            message: `Unauthorized request.`,
          },
        });
    });
  });
});
