const endpointsJson = require("../endpoints.json")
const { fetchTopics,
        fetchArticleById,
        fetchArticles,
        fetchCommentsById,
        attachCommentsById,
        updateArticleVotes,
        removeComment } = require("../model/model.js")

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

exports.getCommentsById = (request, response, next) => {
    const { article_id } = request.params
    fetchCommentsById(article_id)
    .then((comments) => {
        response.status(200).send({ comments: comments })
    }).catch(next)
}

exports.postCommentByArticleId = (request, response, next) => {
    const { article_id } = request.params
    const { username, body } = request.body
    attachCommentsById(article_id, username, body)
    .then((comment) => {
        response.status(201).send({ comment })
    }).catch(next)
}

exports.patchCommentVotes = (request, response, next) => {
    const { article_id } = request.params
    const { inc_votes } = request.body

    if(isNaN(article_id)) {
        return response.status(400).json({ message: "Invalid request."})
    }

    if(typeof inc_votes !== "number") {
        return response.status(400).json({ message: "Invalid request."})
    }
    updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
        if(!updatedArticle) {
            return response.status(404).json({ message: "Article ID could not be found."})
        }
        response.status(200).json({ article: updatedArticle })
    }).catch(next)
}

exports.deleteComment = (request, response, next) => {
    const { comment_id } = request.params
    removeComment(comment_id)
    .then(() => {
        response.status(204).send()
    }).catch(next)
}

exports.handlePsqlErrors = (error, request, response, next) => {
    if (error.status) {
        response.status(error.status).send({ message: error.message })
    } else if (error.code === "22P02") {
        response.status(400).send({ message: "Bad request."})
    } else {
        response.status(500).send({ message: "Internal Server Error" })
    }
}

