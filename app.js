const express = require("express")
const app = express()
const { getEndpoints,
        getTopics,
        getArticleById,
        getArticles, 
        getCommentsById} = require("./controller/controller.js")

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsById)

app.use((error, request, response, next) => {
    if(error.status && error.message) {
        response.status(error.status)
        .send({ message: error.message })
    } else {
        response.status(500).send({ message: "Internal Server Error" })
    }
})

app.all("*", (request, response, next) => {
    response.status(404)
    .send({ message: "Path not found."})
})

module.exports = app;