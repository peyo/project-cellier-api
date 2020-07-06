const express = require("express");
const ScentsService = require("./scents-service");
const ScentsRouter = express.Router();

ScentsRouter.route("/")
  .get((req, res, next) => {
  const knexInstance = req.app.get("db");
  ScentsService.getAllScents(knexInstance)
    .then((scents) => {
      res.json(scents);
    })
    .catch(next);
  });

ScentsRouter.route("/:id")
  .all(checkScentExists)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ScentsService.getById(knexInstance, req.params.id)
      .then((scent) => {
        if (!scent) {
          return res.status(404).json({
            error: `Scent doesn't exist.`,
          });
        }
        res.json(scent);
      })
      .catch(next);
  });

ScentsRouter.route("/:id/ratings")
  .all(checkScentExists)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ScentsService.getRatings(knexInstance, req.params.id)
      .then((ratings) => {
        res.json(ratings);
      })
      .catch(next);
  });

async function checkScentExists(req, res, next) {
  const knexInstance = req.app.get("db");
  try {
    const scent = await ScentsService.getById(knexInstance, req.params.id);

    if (!scent)
      return res.status(404).json({
        error: `Scent doesn't exist.`,
      });

    res.scent = scent;
    next();
  } catch (error) {
    next(error);
  };
};

module.exports = ScentsRouter;
