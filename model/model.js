const db = require('../db/connection.js')

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows
    })
}

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
        if(rows.length == 0) {
            return Promise.reject({ status: 404, message: "Article ID could not be found."})
        }
        return rows[0]
    })
}

exports.fetchArticles = (order = "desc") => {
    const validOrders = ["asc", "desc"]
    const finalOrder = validOrders.includes(order?.toLowerCase()) ? order.toLowerCase() : "desc" 

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
        ORDER BY articles.created_at ${finalOrder.toUpperCase()}`)
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchCommentsById = (id) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`, [id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return db.query(`SELECT 1 FROM articles WHERE article_id = $1`, [id])
                .then(({ rows: articleRows }) => {
                    if(articleRows.length === 0) {
                        return Promise.reject({ status: 404, message: "Article ID could not be found." })
                    }
                    return []
                })
            }
            return rows
        })
    }

exports.attachCommentsById = (article_id, username, body) => {
    if (!username || !body) {
        return Promise.reject({status: 400,message: "Bad request. Missing username or body."});
    }
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, message: "User or article could not be found."});
                }
            return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,[article_id, username, body]);
            })
            .then(({ rows }) => {
            return rows[0]
            })
    }
exports.updateArticleVotes = (article_id, inc_votes) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
    .then(({ rows }) => {
        return rows[0]
    })
} 

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, message: "Comment ID could not be found."})
        }
        return
    })
}

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({ rows }) => {
        return rows
    })
}

    