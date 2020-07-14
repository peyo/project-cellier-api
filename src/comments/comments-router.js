const express = require("express");
const CommentsService = require("./comments-service");
const CommentsRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const jwt = require("jsonwebtoken");
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
    const { scents_id, comment, date_created } = req.body;
    const newComment = { scents_id, comment };
    const knexInstance = req.app.get("db");

    for (const [key, value] of Object.entries(newComment))
      if (value == null) {
        return res.status(400).json({
          error: {
            message: `Missing "${key}" in request body.`,
          },
        });
      }

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
  .delete(requireAuth, async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const comment = await CommentsService.getById(knexInstance, req.params.id);

    if (comment === undefined) {
      return res.status(404).json({
        error: {
          message: `Comment doesn't exist.`
        },
      });
    }

    if (comment.users_id !== req.users.id) {
      return res.status(401).json({
        error: {
          message: `You can only delete your own comments.`
        },
      });
    }

    CommentsService.deleteComment(knexInstance, req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, jsonParser, async (req, res, next) => {
    const { comment, date_edited } = req.body;
    const updatedComment = { comment };
    const knexInstance = req.app.get("db");

    const numberOfValues = Object.values(updatedComment).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain comment.`,
        },
      });
    }

    const checkComment = await CommentsService.getById(knexInstance, req.params.id);

    if (checkComment === undefined) {
      return res.status(404).json({
        error: {
          message: `Comment doesn't exist.`
        },
      });
    }

    if (checkComment.users_id !== req.users.id) {
      return res.status(401).json({
        error: {
          message: `You can only edit your own comments.`
        },
      });
    }

    updatedComment.date_edited = date_edited;
    CommentsService.updateComment(knexInstance, req.params.id, updatedComment)
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
