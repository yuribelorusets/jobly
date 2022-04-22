"use strict";

const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testId
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "test",
    salary: 5000,
    equity: null,
    company_handle: "c2",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job.title).toEqual("test");

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE company_handle = 'c2'`
    );

    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        title: "test",
        salary: 5000,
        equity: null,
        company_handle: "c2",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Job.create(newJob);
      await Job.create(newJob);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j1",
        salary: 1000,
        equity: "0.01",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "j2",
        salary: 2000,
        equity: "0.02",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "j3",
        salary: 3000,
        equity: null,
        companyHandle: "c1",
      },
    ]);
  });

  // test("works: with filter", async function () {
  //   let jobs = await Job.findAll({});
  //   expect(jobs).toEqual([
  //     {
  //       id: expect.any(Number),
  //       title: "j1",
  //       salary: 1000,
  //       equity: ".01",
  //       companyHandle: "c1",
  //     },
  //     {
  //       id: expect.any(Number),
  //       title: "j2",
  //       salary: 2000,
  //       equity: ".02",
  //       companyHandle: "c1",
  //     },
  //     {
  //       id: expect.any(Number),
  //       title: "j3",
  //       salary: 3000,
  //       equity: null,
  //       companyHandle: "c1",
  //     },
  //   ]);
  // });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(testId[0]);
    expect(job).toEqual({
      id: testId[0],
      title: "j1",
      salary: 1000,
      equity: "0.01",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "j5",
    salary: 1000,
    equity: "0.01",
  };

  test("works", async function () {
    let job = await Job.update(testId[0], updateData);
    expect(job).toEqual({
      id: testId[0],
      title: "j5",
      salary: 1000,
      equity: "0.01",
      companyHandle: "c1",
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
          FROM jobs
          WHERE id = ${testId[0]}`
    );
    expect(result.rows).toEqual([
      {
        id: testId[0],
        title: "j5",
        salary: 1000,
        equity: "0.01",
        companyHandle: "c1",
      },
    ]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "j1",
      salary: 1000,
      equity: null,
    };

    let job = await Job.update(testId[0], updateDataSetNulls);
    expect(job).toEqual({
      id: testId[0],
      companyHandle: "c1",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id, title, salary, company_handle AS "companyHandle"
           FROM jobs
           WHERE id = ${testId[0]}`
    );
    expect(result.rows).toEqual([
      {
        companyHandle: "c1",
        title: "j1",
        salary: 1000,
        id: testId[0],
      },
    ]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with invalid data", async function () {
    try {
      await Job.update("c1", {jobName: "test bad"});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

  test("bad request with no data", async function () {
    try {
      await Job.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(testId[0]);
    const res = await db.query(`SELECT id FROM jobs WHERE id=${testId[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
