const jwt = require("jsonwebtoken");

function makeAuthHeader(users, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ users_id: users.id }, secret, {
    subject: users.username,
    algorithm: "HS256",
  });
  return `Bearer ${token}.`;
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE TABLE users, groups, scents, comments, ratings RESTART IDENTITY CASCADE`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE groups_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE scents_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE ratings_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('groups_id_seq', 0)`),
          trx.raw(`SELECT setval('scents_id_seq', 0)`),
          trx.raw(`SELECT setval('comments_id_seq', 0)`),
          trx.raw(`SELECT setval('ratings_id_seq', 0)`),
        ])
      )
  );
}

module.exports = { makeAuthHeader, cleanTables };
