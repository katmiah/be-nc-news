const endpointsJson = require("../endpoints.json")
const { fetchTopics } = require("../model/model.js")

exports.getEndpoints = (request, response) => {
        response.status(200).json({endpoints: endpointsJson}) 
}

exports.getTopics = (request, response) => {
    fetchTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
}

