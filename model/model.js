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
            console.log(rows, "modelllllll")
            return Promise.reject({ status: 404, message: "Article ID could not be found."})
        }
        return rows[0]
    })
}




