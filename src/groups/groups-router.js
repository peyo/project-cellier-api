const express = require("express");
const GroupsService = require("./groups-service");

const GroupsRouter = express.Router();

GroupsRouter.route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    GroupsService.getAllGroups(knexInstance)
      .then((groups) => {
        res.json(groups.map(GroupsService.serializeGroup));
      })
      .catch(next);
  });

GroupsRouter.route("/:id")
  .all(checkGroupExists)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    GroupsService.getById(knexInstance, req.params.id)
      .then((group) => {
        if (!group) {
          return res.status(404).json({
            error: `Group doesn't exist.`
          });
        }
        res.json(group);
      })
      .catch(next);
  });

async function checkGroupExists(req, res, next) {
  const knexInstance = req.app.get("db");
  try {
    const group = await GroupsService.getById(knexInstance, req.params.id);

    if (!group)
      return res.status(404).json({
        error: `Group doesn't exist.`,
      });

    res.group = group;
    next();
  } catch (error) {
    next(error);
  };
};

module.exports = GroupsRouter;
