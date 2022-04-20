const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");
const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

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
