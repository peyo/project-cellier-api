const knex = require("knex");
const CommentsService = require("../src/comments/comments-service");
const TestComments = require("./data/test-comments");
const TestScents = require("./data/test-scents");
const TestGroups = require("./data/test-groups");
const TestUsers = require("./data/test-users");
const { expect } = require("chai");

describe(`Comments service object`, function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
  });

  before(() => {
    return db.raw("TRUNCATE TABLE users, groups, scents, comments CASCADE");
  });

  before(() => db('comments').truncate())

  afterEach(() => {
    return db.raw("TRUNCATE TABLE users, groups, scents, comments CASCADE");
  });

  afterEach(() => db('comments').truncate())

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

    it(`getAllComments() resolves all comments from "comments" table"`, () => {
      const expected = [
        {
          id: 1,
          scents_id: 1,
          comment: "Smells soothing!",
          users_id: 1,
          date_created: new Date("2029-01-22T16:28:32.615Z"),
          date_edited: new Date("2029-01-22T16:28:32.615Z")
        },
        {
          id: 2,
          scents_id: 1,
          comment: "Refreshing",
          users_id: 2,
          date_created: new Date("2029-01-22T16:28:32.615Z"),
          date_edited: new Date("2029-01-22T16:28:32.615Z")
        },
      ];
      
      return CommentsService.getAllComments(db).then((actual) => {
        expect(actual).to.eql(expected);
      });
    });

    it(`getById() resolves a comment by id from "comments" table"`, () => {
      const id = 2;
      const testComment = TestComments[id - 1];

      return CommentsService.getById(db, id).then((actual) => {
        expect(actual).to.eql({
          id: id,
          scents_id: testComment.scents_id,
          comment: testComment.comment,
          users_id: testComment.users_id,
          date_created: new Date("2029-01-22T16:28:32.615Z"),
          date_edited: new Date("2029-01-22T16:28:32.615Z")
        });
      });
    });

    it(`deleteComment() removes a comment by id from "comments" table`, () => {
      const id = 2;

      return CommentsService.deleteComment(db, id)
        .then(() => CommentsService.getAllComments(db))
        .then((actual) => {
          expect(actual).to.eql([
            {
            id: 1,
            scents_id: TestComments[0].scents_id,
            comment: TestComments[0].comment,
            users_id: TestComments[0].users_id,
            date_created: new Date("2029-01-22T16:28:32.615Z"),
            date_edited: new Date("2029-01-22T16:28:32.615Z")
            }
          ]);
        });
    });

    it(`updateComment() updates a comment from the "comments" table`, () => {
      const id = 2;
      const newComment = {
        id: id,
        scents_id: 1,
        comment: "Enticing",
        users_id: 2,
        date_created: new Date("2029-01-22T16:28:32.615Z"),
        date_edited: new Date(),
      };

      return CommentsService.updateComment(db, id, newComment)
        .then(() => CommentsService.getById(db, id))
        .then((comment) => {
          expect(comment).to.eql({
            id: id,
            ...newComment,
          });
        });
    });
  });

  context(`Given "comments" has no data.`, () => {
    beforeEach(() => {
      return db.into("users").insert(TestUsers);
    });

    beforeEach(() => {
      return db.into("groups").insert(TestGroups);
    });
    
    beforeEach(() => {
      return db.into("scents").insert(TestScents);
    });

    it(`insertComment() inserts a new comment and resolves the new comment with an id`, () => {
      let newComment = {
        scents_id: 1,
        comment: "Enriching...",
        users_id: 1,
        date_created: new Date("2029-01-22T16:28:32.615Z"),
        date_edited: new Date("2029-01-22T16:28:32.615Z")
      };

      return CommentsService.insertComment(db, newComment).then((actual) => {
        expect(actual).to.eql({
          id: 1,
          scents_id: newComment.scents_id,
          comment: newComment.comment,
          users_id: newComment.users_id,
          date_created: newComment.date_created,
          date_edited: newComment.date_edited,
        });
      });
    });
  });
});