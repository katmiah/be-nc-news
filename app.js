const express = require('express')
const app = express()
const { getEndpoints } = require("./controller/controller.js")

app.get('/api', getEndpoints)

module.exports = app;