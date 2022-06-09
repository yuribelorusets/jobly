const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");
const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, createWhereSql, createWhereSqlJob } = require("./sql");

describe("sqlForPartialUpdate", function () {
  test("works: data passed in", function () {
    const data = sqlForPartialUpdate({ numEmployees: "10", name: "test" },
      { numEmployees: "num_employees", name: "name"});

    expect(data).toEqual({
      setCols: '"num_employees"=$1, "name"=$2',
      values: ["10", "test"],
    });
  });

  test("works: no data passed in", function () {
    try {
      sqlForPartialUpdate({},{});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("createWhereSql", function () {
  test("works: valid data passed in (1 param)", function () {
    const data = createWhereSql({ minEmployees: 10});

    expect(data).toEqual({
      filterConditions: "WHERE num_employees >= $1",
      values: [10]
    });
  });

  test("works: valid data passed in (mult params)", function () {
    const data = createWhereSql({ minEmployees: 10, maxEmployees: 300, nameLike: "test"});

    expect(data).toEqual({
      filterConditions: "WHERE num_employees <= $1 AND num_employees >= $2 AND name ILIKE $3",
      values: [300, 10, `%test%`]
    });
  });

  test("works: invalid data passed in", function () {
    try {
      createWhereSql({favoriteColor: "orange"});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("works: no data passed in", function () {

    const data = createWhereSql({});

    expect(data).toEqual({
      filterConditions: "",
      values: []
    });
  });
});

describe("createWhereSqlJob", function () {
  test("works: valid data passed in (1 param)", function () {
    const data = createWhereSqlJob({ minSalary: 10});

    expect(data).toEqual({
      filterConditions: "WHERE salary >= $1",
      values: [10]
    });
  });

  test("works: valid data passed in (mult params)", function () {
    const data = createWhereSqlJob({ minSalary: 10, hasEquity: true, title: "test"});

    expect(data).toEqual({
      filterConditions: "WHERE title ILIKE $1 AND salary >= $2 AND equity != null",
      values: [ `%test%`, 10,]
    });
  });

  test("works: invalid data passed in", function () {
    try {
      createWhereSqlJob({favoriteColor: "orange"});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("works: no data passed in", function () {

    const data = createWhereSqlJob({});

    expect(data).toEqual({
      filterConditions: "",
      values: []
    });
  });
});
