const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, filterValidComments } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments CASCADE")
    .then(() => db.query("DROP TABLE IF EXISTS articles CASCADE"))
    .then(() => db.query("DROP TABLE IF EXISTS users CASCADE"))
    .then(() => db.query("DROP TABLE IF EXISTS topics CASCADE"))
    .then(() => createTopicData(topicData))
    .then(() => createUserData(userData))
    .then(() => createArticleData(articleData))  
    .then((articleResult) => {
      const updatedCommentData = updateCommentDataWithArticleIds(articleData, commentData, articleResult);
      return createCommentData(updatedCommentData); 
    });
};

function createUserData(users) {
  return db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL)`).then(() => {
      const insertedData = users.map((user) => [
        user.username,
        user.name,
        user.avatar_url,
      ]);
      const insertedStr = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *`, insertedData);

      return db.query(insertedStr);
    });
}

function createTopicData(topics) {
  return db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR NOT NULL,
    img_url VARCHAR(1000) NOT NULL)`).then(() => {
      const insertedData = topics.map((topic) => [
        topic.slug,
        topic.description,
        topic.img_url,
      ]);
      const insertedStr = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *`, insertedData);

      return db.query(insertedStr);
    });
}

function createArticleData(articles) {
  return db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES topics(slug),
    author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000) NOT NULL
  )`).then(() => {
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
      insertedData);

    return db.query(insertStr);
  });
}

function createCommentData(comments) {
  const validComments = filterValidComments(comments);

  return db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW())`).then(() => {
    if (validComments.length === 0) return [];

    const insertedData = validComments.map((comment) => [
      comment.article_id,
      comment.body,
      comment.votes || 0,
      comment.author,
      new Date(comment.created_at).toISOString()
    ]);
    const insertStr = format(
      `INSERT INTO comments (article_id, body, votes, author, created_at) 
       VALUES %L RETURNING *`, insertedData);

    return db.query(insertStr);
  });
}

function updateCommentDataWithArticleIds(articleData, commentData, articleResult) {
  const articleIdsMap = articleResult.rows.reduce((acc, article) => {
    acc[article.title] = article.article_id; 
    return acc;
  }, {});

 
  return commentData.map((comment) => ({
    ...comment,
    article_id: articleIdsMap[comment.article_title] || null 
  }));
}

module.exports = seed;
