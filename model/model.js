const db = require('../db/connection.js')

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows
    })
}

exports.fetchArticleById = (id) => {
    if(isNaN(id)) {
        return Promise.reject({ status: 400, message: "Bad request."})
    }
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
        if(rows.length == 0) {
            return Promise.reject({ status: 404, message: "Article ID could not be found."})
        }
        return rows[0]
    })
}

exports.fetchArticles = () => {
    return db.query(`SELECT articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`)
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchCommentsById = (id) => {
    if(isNaN(id)) {
        return Promise.reject({ status: 400, message: "Bad request."})
    }
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`, [id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, message: "Article ID could not be found." })
            }
            return rows
        })
}



