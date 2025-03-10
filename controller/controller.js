const endpointsJson = require("../endpoints.json")
const { fetchTopics,
        fetchArticleById } = require("../model/model.js")

exports.getEndpoints = (request, response) => {
        response.status(200).json({endpoints: endpointsJson}) 
}

exports.getTopics = (request, response) => {
    fetchTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
}

exports.getArticleById = (request, response) => {
    const { article_id } = request.params
    fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({ article })
    })
}

