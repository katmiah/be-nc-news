const express = require("express")
const app = express()
const { getEndpoints,
        getTopics,
        getArticleById } = require("./controller/controller.js")

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.all("*", (request, response, next) => {
    response.status(404)
    .send({ message: "Path not found."})
})

module.exports = app;