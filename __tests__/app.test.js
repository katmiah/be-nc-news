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
})