const express = require("express");
const RatingsService = require("./ratings-service");
const RatingsRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");

RatingsRouter.route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    RatingsService.getAllRatings(knexInstance)
      .then((ratings) => {
        res.json(ratings);
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { scents_id, rating, date_created } = req.body;
    const newRating = { scents_id, rating };
    const knexInstance = req.app.get("db");

    for (const [key, value] of Object.entries(newRating))
      if (value == null)
        return res.status(400).json({
          error: {
            message: `Missing "${key}" in request body.`,
          },
        });

    newRating.users_id = req.users.id;
    newRating.date_created = date_created;

    RatingsService.insertRating(knexInstance, newRating)
      .then((rating) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${rating.id}`))
          .json(rating);
      })
      .catch(next);
  });

RatingsRouter.route("/:id")
  .all(checkRatingExists)
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    RatingsService.getById(knexInstance, req.params.id)
      .then((rating) => {
        if (!rating) {
          return res.status(400).json({
            error: {
              message: `Rating doesn't exist.`,
            },
          });
        }
        res.rating = rating;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      id: res.rating.id,
      scents_id: res.rating.scents_id,
      rating: res.rating.rating,
      users_id: res.rating.users_id,
      date_created: res.rating.date_created,
      date_edited: res.rating.date_edited,
    });
  })
  .patch(requireAuth, jsonParser, async (req, res, next) => {
    const { rating } = req.body;
    const newRating = { rating };
    const knexInstance = req.app.get("db");

    const numberOfValues = Object.values(newRating).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain rating.`,
        },
      });
    }

    const checkRating = await RatingsService.getById(knexInstance, req.params.id);

    if (checkRating === undefined) {
      return res.status(404).json({
        error: {
          message: `Comment doesn't exist.`
        },
      });
    }

    if (checkRating.users_id !== req.users.id) {
      return res.status(401).json({
        error: {
          message: `You can only edit your own rated items.`
        },
      });
    }

    newRating.users_id = req.users.id;

    RatingsService.updateRating(knexInstance, req.params.id, newRating)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkRatingExists(req, res, next) {
  const knexInstance = req.app.get("db");
  try {
    const rating = await RatingsService.getById(knexInstance, req.params.id);
    if (!rating)
      return res.status(404).json({
        error: {
          message: `Rating doesn't exist.`,
        },
      });

    res.rating = rating;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = RatingsRouter;
