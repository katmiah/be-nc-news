const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest")
const app = require("../app.js")
const data = require("../db/data/test-data")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")

/* Set up your beforeEach & afterAll functions here */
beforeEach(()=>{
  return seed(data)
})
afterAll(()=>{
  db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects with the properties of slug and description", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      const topics = body.topics
      expect(body.topics.length).toBe(3)
      topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String)
        })
      })
    })
  })
})

  test("404: Responds with an error message when endpoint is invalid", () => {
    return request(app)
    .get("/api/topcs")
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("Path not found.")
    })
  })


describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object by its requested ID", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body }) => {
      const article = body.article;
      expect(article).toMatchObject({
        article_id: 1,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
    })
  })

  test("404: Responds with error message if article ID could not be found", () => {
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("Article ID could not be found.")
    })
  })

  test("400: Responds with error message if article ID is invalid", () => {
    return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .then(({ body }) => {
      expect(body.message).toBe("Bad request.")
    })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of objects with all the properties of articles", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      body.articles.forEach((article) => {
        expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(String),
        })
      })
    })
  })

  test("404: Responds with error message when endpoint is invalid", () => {
    return request(app)
    .get("/api/aritcles")
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("Path not found.")
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article ID", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      console.log(body, "first log")
      const comments = body.comments
      console.log(comments, "second log")
      comments.forEach((comment) => {
      expect(comment).toMatchObject({
        article_id: 1,
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        body: expect.any(String),
        author: expect.any(String)
        })
      })
    })
  })

  test("404: Responds with error message if article ID could not be found", () => {
    return request(app)
    .get("/api/articles/999/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("Article ID could not be found.")
    })
  })

  test("400: Responds with error message if article ID is invalid", () => {
    return request(app)
    .get("/api/articles/banana/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.message).toBe("Bad request.")
    })
  })
})