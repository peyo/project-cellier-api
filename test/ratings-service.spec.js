const knex = require("knex");
const RatingsService = require("../src/ratings/ratings-service");
const TestRatings = require("./data/test-ratings");
const TestScents = require("./data/test-scents");
const TestGroups = require("./data/test-groups");
const TestUsers = require("./data/test-users");
const { expect } = require("chai");

describe(`Ratings service object`, function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
  });

  before(() => {
    return db.raw("TRUNCATE TABLE users, groups, scents, ratings CASCADE");
  });

  afterEach(() => {
    return db.raw("TRUNCATE TABLE users, groups, scents, ratings CASCADE");
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

    it(`getAllRatings() resolves all ratings from "ratings" table"`, () => {
      const expected = [
        {
          id: 1,
          scents_id: 1,
          rating: 4,
          users_id: 1,
          date_created: new Date("2029-01-22T16:28:32.615Z"),
          date_edited: new Date("2029-01-22T16:28:32.615Z")
        },
        {
          id: 2,
          scents_id: 1,
          rating: 5,
          users_id: 2,
          date_created: new Date("2029-01-22T16:28:32.615Z"),
            date_edited: new Date("2029-01-22T16:28:32.615Z")
        },
        {
          id: 3,
          scents_id: 2,
          rating: 5,
          users_id: 3,
          date_created: new Date("2029-01-22T16:28:32.615Z"),
            date_edited: new Date("2029-01-22T16:28:32.615Z")
        }
      ]
      
      return RatingsService.getAllRatings(db).then((actual) => {
        expect(actual).to.eql(expected);
      });
    });

    it(`getById() resolves a rating by id from "ratings" table"`, () => {
      const id = 2;
      const testRating = TestRatings[id - 1];

      return RatingsService.getById(db, id).then((actual) => {
        expect(actual).to.eql({
          id: id,
          scents_id: testRating.scents_id,
          rating: testRating.rating,
          users_id: testRating.users_id,
          date_created: new Date("2029-01-22T16:28:32.615Z"),
          date_edited: new Date("2029-01-22T16:28:32.615Z"),
        });
      });
    });

    it(`updateRatings() updates a rating from the "ratings" table`, () => {
      const id = 2;
      const testRating = TestRatings[id - 1];
      const updatedRating = {
        id: id,
        scents_id: testRating.scents_id,
        rating: 1,
        users_id: testRating.users_id,
        date_created: new Date("2029-01-22T16:28:32.615Z"),
        date_edited: new Date(),
      };

      return RatingsService.updateRating(db, id, updatedRating)
        .then(() => RatingsService.getById(db, id))
        .then((rating) => {
          expect(rating).to.eql({
            id: id,
            ...updatedRating,
          });
        });
    });
  });

  context(`Given "ratings" has no data.`, () => {
    beforeEach(() => {
      return db.into("users").insert(TestUsers);
    });
    
    beforeEach(() => {
      return db.into("groups").insert(TestGroups);
    });

    beforeEach(() => {
      return db.into("scents").insert(TestScents);
    });

    it(`insertRating() inserts a new rating and resolves the new rating with an id`, () => {
      let newRating = {
        scents_id: 1,
        rating: 1,
        users_id: 1,
        date_created: new Date("2029-01-22T16:28:32.615Z"),
        date_edited: new Date("2029-01-22T16:28:32.615Z"),
      };

      return RatingsService.insertRating(db, newRating).then((actual) => {
        expect(actual).to.eql({
          id: actual.id,
          scents_id: newRating.scents_id,
          rating: newRating.rating,
          users_id: newRating.users_id,
          date_created: newRating.date_created,
          date_edited: newRating.date_edited,
        });
      });
    });
  });
});