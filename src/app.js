require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const ScentsRouter = require("./scents/scents-router");
const GroupsRouter = require("./groups/groups-router");
const CommentsRouter = require("./comments/comments-router");
const RatingsRouter = require("./ratings/ratings-router");

const app = express();
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/scents", ScentsRouter);
app.use("/api/groups", GroupsRouter);
app.use("/api/comments", CommentsRouter);
app.use("/api/ratings", RatingsRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "Server error." } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;