const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const sorted = require("jest-sorted");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
});

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
        const topics = body.topics;
        expect(body.topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

test("404: Responds with an error message when endpoint is invalid", () => {
  return request(app)
    .get("/api/topcs")
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("Path not found.");
    });
});

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
          article_img_url: expect.any(String),
        });
        const commentCount = parseInt(article.article_id, 10);
        expect(commentCount).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(commentCount)).toBe(true);
      });
  });

  test("404: Responds with error message if article ID could not be found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article ID could not be found.");
      });
  });

  test("400: Responds with error message if article ID is invalid", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid request.");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of objects with all the properties of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("404: Responds with error message when endpoint is invalid", () => {
    return request(app)
      .get("/api/aritcles")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found.");
      });
  });

  describe("Sort by queries", () => {
    test("200: Responds with created_at in ascending order", () => {
      return request(app)
        .get(`/api/articles?order=asc`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted("created_at", { descending: false });
        });
    });

    test("200: Responds with created_at in descending order", () => {
      return request(app)
        .get(`/api/articles?order=desc`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted("created_at", { descending: true });
        });
    });

    test("200: Responds with created_at in default order (descending)", () => {
      return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(13);
          expect(body.articles).toBeSorted("created_at", { descending: true });
        });
    });

    test("400: Responds with error message for invalid order query", () => {
      return request(app)
        .get(`/api/articles?order=orderbyinvalid`)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid order query");
        });
    });
  });

  describe("Filter queries", () => {
    test("200: Responds with filtered articles", () => {
      return request(app)
        .get(`/api/articles?topic=mitch`)
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });

    test("404: Responds with error message if no articles by that name", () => {
      return request(app)
        .get(`/api/articles?topic=invalid`)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("No articles found.");
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: expect.any(String),
            author: expect.any(String),
          });
        });
      });
  });

  test("200: Responds with an empty array if article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });

  test("404: Responds with error message if article ID could not be found", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article ID could not be found.");
      });
  });

  test("400: Responds with error message if article ID is invalid", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid request.");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with posted comment with username and body properties", () => {
    const newComment = { username: "butter_bridge", body: "Hello!" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          author: "butter_bridge",
          body: "Hello!",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("404: Responds with error message if user could not be found", () => {
    const newComment = { username: "idontexist", body: "Hello!" };
    return request(app)
      .post(`/api/articles/1/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("User or article could not be found.");
      });
  });

  test("404: Responds with error message if article ID does not exist", () => {
    const newComment = { username: "tickle122", body: "Great article!" };

    return request(app)
      .post(`/api/articles/999/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("User or article could not be found.");
      });
  });

  test("400: Responds with error message if body or username is missing", () => {
    const newComment = { username: "tickle122" };

    return request(app)
      .post(`/api/articles/1/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request. Missing username or body.");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with updated votes property ", () => {
    return request(app)
      .patch(`/api/articles/1/`)
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: 110,
        });
      });
  });

  test("404: Responds with error message if article ID could not be found", () => {
    return request(app)
      .patch(`/api/articles/999`)
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article ID could not be found.");
      });
  });

  test("400: Responds wuth error message if article ID is invalid", () => {
    return request(app)
      .patch(`/api/articles/banana`)
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid request.");
      });
  });

  test("400: Responds with error message if votes_inc is not a number", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid request.");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes given comment by comment ID", () => {
    return request(app)
      .delete(`/api/comments/3`)
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = 3`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });

  test("404: Responds with error message if comment ID does not exist", () => {
    return request(app)
      .delete(`/api/comments/9999`)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment ID could not be found.");
      });
  });

  test("400: Responds with error message if comment ID is invalid", () => {
    return request(app)
      .delete(`/api/comments/banana`)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid request.");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of objects with user properties", () => {
    return request(app)
      .get(`/api/users`)
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(body.users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });

  test("404: Responds with error message if endpoint is invalid", () => {
    return request(app)
      .get(`/api/uers`)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found.");
      });
  });
});
