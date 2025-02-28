const db = require("../connection")
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments")
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS articles")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS users")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS topics")
  })
  .then(()=>{
    createTopicData(topicData)
  })
  .then(()=>{
    return createUserData(userData)
  })
  .then(()=>{
    return createArticleData(articleData)
  })
  .then(()=>{
    return createCommentData(commentData)
  })
}

function createTopicData(topics) {
  return db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR NOT NULL,
    img_url VARCHAR(1000) NOT NULL)`).then(()=>{
      const insertedData = topics.map((topic) => [
        topic.slug,
        topic.description,
        topic.img_url,
      ]);
      const insertedStr = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *`,insertedData);
        
        return db.query(insertedStr);
    })
}
function createUserData(users) {
  return db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL)`).then(()=>{
      const insertedData = users.map((user) => [
        user.username,
        user.name,
        user.avatar_url,
      ]);
      const insertedStr = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *`,insertedData);

        return db.query(insertedStr)
    })
}
function createArticleData(articles) {
  return db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR REFERENCES topics(slug),
    author VARCHAR REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000) NOT NULL)`).then(()=>{
      const insertedData = articles.map((article) => [
        article.title,
        article.topic,
        article.author,
        article.body,
        new Date(article.created_at).toISOString(),
        article.votes || 0, 
        article.article_img_url,
      ]);
      const insertStr = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) 
         VALUES %L RETURNING *`, 
        insertedData)
        
        return db.query(insertStr)
    })
}
function createCommentData(comments) {
  return db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR REFERENCES users(username),
    created_at TIMESTAMP)`).then(()=>{
      const insertedData = comments.map((comment) => [
        comment.article_id,
        comment.body,
        comment.votes || 0,
        comment.author,
        new Date(comment.created_at).toISOString()
      ]);
      const insertStr = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *`, insertedData)

      return db.query(insertStr)
    })
}

module.exports = seed
