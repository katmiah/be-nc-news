const endpointsJson = require("../endpoints.json")
const { fetchTopics,
        fetchArticleById,
        fetchArticles } = require("../model/model.js")

exports.getEndpoints = (request, response) => {
        response.status(200).json({endpoints: endpointsJson}) 
}

exports.getTopics = (request, response, next) => {
    fetchTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    }).catch(next)
}

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params
    fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({ article })
    }).catch(next)
}

exports.getArticles = (request, response, next) => {
    fetchArticles()
    .then((articles) => {
        response.status(200).send({ articles })
    }).catch(next)
}

exports.handlePsqlErrors = (error, request, response, next) => {
    if(error.code === "22P02") {
        response.status(400).send({ message: "Bad request."})
    }
}

