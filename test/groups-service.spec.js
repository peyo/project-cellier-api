const knex = require("knex");
const GroupsService = require("../src/groups/groups-service");
const TestGroups = require("./data/test-groups");
const { expect } = require("chai");

describe(`Groups service object`, function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
  });

  before(() => {
    return db.raw("TRUNCATE TABLE groups CASCADE");
  });

  afterEach(() => {
    return db.raw("TRUNCATE TABLE groups CASCADE");
  });

  after(() => {
    return db.destroy();
  });

  context(`Given "scents" has data.`, () => {
    beforeEach(() => {
      return db.into("groups").insert(TestGroups);
    });

    it(`getAllGroups() resolves all groups from "groups" table"`, () => {
      return GroupsService.getAllGroups(db).then((actual) => {
        expect(actual).to.eql(TestGroups);
      });
    });

    it(`getById() resolves a group by id from "groups" table"`, () => {
      const id = 3;
      const testGroup = TestGroups[id - 1];

      return GroupsService.getById(db, id).then((actual) => {
        expect(actual).to.eql({
          id: id,
          group_name: testGroup.group_name,
          subgroup_name: testGroup.subgroup_name,
          description: testGroup.description,
          triangle_a: testGroup.triangle_a,
          triangle_b: testGroup.triangle_b,
          linear_a: testGroup.linear_a,
          linear_b: testGroup.linear_b
        });
      });
    });

  });
});