const express = require("express");
const app = express();
const cors = require("cors");
const { handlePsqlErrors } = require("./controller/controller.js");
const {
  getEndpoints,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsById,
  postCommentByArticleId,
  patchCommentVotes,
  deleteComment,
  getUsers,
} = require("./controller/controller.js");

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchCommentVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use(handlePsqlErrors);

app.use((error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    response.status(500).send({ message: "Internal Server Error" });
  }
});

app.all("*", (request, response, next) => {
  response.status(404).send({ message: "Path not found." });
});

module.exports = app;
