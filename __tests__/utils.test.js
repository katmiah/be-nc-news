const {
  convertTimestampToDate,
  filterValidComments
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("filterValidComments", () => {
  test("removes comments with null article_id", () => {
    const input = [
      { article_id: 1, body: "Valid comment 1", author: "user1" },
      { article_id: null, body: "Invalid comment", author: "user2" },
      { article_id: 2, body: "Valid comment 2", author: "user3" },
    ];
    const expected = [
      { article_id: 1, body: "Valid comment 1", author: "user1" },
      { article_id: 2, body: "Valid comment 2", author: "user3" },
    ];
    expect(filterValidComments(input)).toEqual(expected);
  });

  test("removes comments with undefined article_id", () => {
    const input = [
      { article_id: 3, body: "Valid comment 3", author: "user1" },
      { article_id: undefined, body: "Invalid comment", author: "user2" },
    ];
    const expected = [
      { article_id: 3, body: "Valid comment 3", author: "user1" },
    ];
    expect(filterValidComments(input)).toEqual(expected);
  });

  test("returns an empty array if all comments have invalid article_id", () => {
    const input = [
      { article_id: null, body: "Invalid comment", author: "user1" },
      { article_id: undefined, body: "Invalid comment", author: "user2" },
    ];
    expect(filterValidComments(input)).toEqual([]);
  });

  test("returns the same array if all comments have valid article_id", () => {
    const input = [
      { article_id: 1, body: "Valid comment 1", author: "user1" },
      { article_id: 2, body: "Valid comment 2", author: "user2" },
    ];
    expect(filterValidComments(input)).toEqual(input);
  });

  test("returns an empty array when given an empty array", () => {
    expect(filterValidComments([])).toEqual([]);
  });
});

