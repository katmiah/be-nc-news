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
      expect(body.topics.length).toBe(3)
      body.topics.forEach((topic) => {
        const { slug, description } = topic
        expect(typeof slug).toBe("string")
        expect(typeof description).toBe("string")
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
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object by its requested ID", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body }) => {
      const { article_id, title, topic, author, body: articleBody, created_at, votes, article_img_url } = body.article;
      expect(article_id).toBe(1)
      expect(typeof title).toBe("string")
      expect(typeof topic).toBe("string")
      expect(typeof author).toBe("string")
      expect(typeof articleBody).toBe("string")
      expect(typeof created_at).toBe("string")
      expect(typeof votes).toBe("number")
      expect(typeof article_img_url).toBe("string")
    })
  })
  
  test("404: Responds with error message if article ID could not be found", () => {
    console.log("hello")
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({ body }) => {
      console.log(body)
      expect(body.message).toBe("Article ID could not be found.")
    })
  })
})