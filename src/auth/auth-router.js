const express = require("express");
const AuthService = require("./auth-service");
const { requireAuth } = require("../middleware/jwt-auth");

const AuthRouter = express.Router();
const jsonBodyParser = express.json();

AuthRouter
  .post("/login", jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: {
          message: `Missing "${key}" in request body.`,
        },
      });

  AuthService.getUserWithUserName(req.app.get("db"), loginUser.username)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: {
            message: "Incorrect username or password.",
          },
        });

      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: {
              message: "Incorrect username or password.",
            },
          });

        const sub = dbUser.username;
        const payload = { users_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })
    .catch(next);
});

AuthRouter.post("/refresh", requireAuth, (req, res) => {
  const sub = req.users.username;
  const payload = { users_id: req.users.id };
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  });
});

module.exports = AuthRouter;
