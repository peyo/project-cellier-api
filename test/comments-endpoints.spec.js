const knex = require("knex");
const app = require("../src/app");
const TestScents = require("./data/test-scents");
const TestComments = require("./data/test-comments");
const TestGroups = require("./data/test-groups");
const supertest = require("supertest");
const { expect } = require("chai");

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
    return db.raw("TRUNCATE TABLE groups, scents, comments CASCADE");
  });

  afterEach(() => {
    return db.raw("TRUNCATE TABLE groups, scents, comments CASCADE");
  });

  after(() => {
    return db.destroy();
  });

  context(`Given "comments" has data.`, () => {
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
      return supertest(app)
        .get("/api/comments")
        .expect(200, TestComments);
    });

    it(`GET /api/comments/:id responds with 200 and the specified comment`, () => {
      const id = 2;
      const expected = TestComments[id - 1];
      return supertest(app)
        .get(`/api/comments/${id}`)
        .expect(200, JSON.stringify(expected));
    });

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
        .send(newComment)
        .expect(201)
        .expect((res) => {
          expect(res.body.scents_id).to.eql(newComment.scents_id);
          expect(res.body.comment).to.eql(newComment.comment);

          const actualDate = new Date(res.body.date_created).toLocaleString();
          const expectedDate = new Date().toLocaleString();
          expect(actualDate).to.eql(expectedDate);

          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/comments/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });

    it(`POST /api/comments responds with 400 and an error message when the comment is missing`, () => {
      return supertest(app)
        .post("/api/comments")
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
        .expect(404, {
          error: {
            message: `Comment doesn't exist.`,
          },
        });
    });
  });
});
