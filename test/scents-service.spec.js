const knex = require("knex");
const ScentsService = require("../src/scents/scents-service");
const TestScents = require("./data/test-scents");
const TestRatings = require("./data/test-ratings");
const TestGroups = require("./data/test-groups");
const TestUsers = require("./data/test-users");
const { expect } = require("chai");

describe(`Scents service object`, function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
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

  context(`Given "scents" has data.`, () => {
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

    it(`getAllScents() resolves all scents from "scents" table"`, () => {
      return ScentsService.getAllScents(db).then((actual) => {
        expect(actual).to.eql(TestScents);
      });
    });

    it(`getById() resolves a scent by id from "scents" table"`, () => {
      const id = 3;
      const testScent = TestScents[id - 1];
      const expected = {
        id: id,
        scent_name: testScent.scent_name,
        groups_id: testScent.groups_id,
        note: testScent.note,
        distributor: testScent.distributor,
        manufacturer: testScent.manufacturer,
        type: testScent.type,
        origin_country: testScent.origin_country,
        extra_origin_information: testScent.extra_origin_information,
        odor_description: testScent.odor_description,
        link: testScent.link,
      };

      return ScentsService.getById(db, id).then((actual) => {
        expect(actual).to.eql(expected);
      });
    });

    it(`getRatings() resolves ratings by id from "scents" table`, () => {
      const id = 1;
      const expected = {
        scents_id: id,
        scent_avg: JSON.stringify(4.5)
      };

      return ScentsService.getRatings(db, id).then((actual) => {
        expect(actual).to.eql(expected);
      });
    });
  });

  context(`Given "scents" has no data.`, () => {
    it(`getAllScents() resolves an empty array`, () => {
      return ScentsService.getAllScents(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
  });
});
