const express = require("express");
const CommentsService = require("./comments-service");
const CommentsRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");

CommentsRouter.route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    CommentsService.getAllComments(knexInstance)
      .then((comments) => {
        res.json(comments.map(CommentsService.serializeComment));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { scents_id, comment } = req.body;
    const newComment = { scents_id, comment };
    const knexInstance = req.app.get("db");

    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json({
          error: {
            message: `Missing "${key}" in request body.`,
          },
        });
    
    newComment.users_id = req.users.id;
    newComment.date_created = date_created;

    CommentsService.insertComment(knexInstance, newComment)
      .then((comment) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${comment.id}`))
          .json(CommentsService.serializeComment(comment));
      })
      .catch(next);
  });

CommentsRouter.route("/:id")
  .all(checkCommentExists)
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    CommentsService.getById(knexInstance, req.params.id)
      .then((comment) => {
        if (!comment) {
          return res.status(400).json({
            error: {
              message: `Comment doesn't exist.`,
            },
          });
        }
        res.comment = comment;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(CommentsService.serializeComment(res.comment));
  })
  .delete(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get("db");
    CommentsService.deleteComment(knexInstance, req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { comment, date_edited } = req.body;
    const commentToUpdate = { comment, date_edited };
    const knexInstance = req.app.get("db");

    const numberOfValues = Object.values(commentToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain comment.`,
        },
      });
    }

    CommentsService.updateComment(knexInstance, req.params.id, commentToUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkCommentExists(req, res, next) {
  const knexInstance = req.app.get("db");
  try {
    const comment = await CommentsService.getById(knexInstance, req.params.id);
    if (!comment)
      return res.status(404).json({
        error: {
          message: `Comment doesn't exist.`,
        },
      });

    res.comment = comment;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = CommentsRouter;
