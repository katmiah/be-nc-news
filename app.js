const express = require("express")
const app = express()
const { getEndpoints,
        getTopics } = require("./controller/controller.js")

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.all("*", (request, response, next) => {
    response.status(404)
    .send({ message: "Path not found."})
})

module.exports = app;