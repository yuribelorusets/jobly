"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, createWhereSql } = require("../helpers/sql");

/** Related functions for companies. */

class Job {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ title, salary, equity, company_handle }) {
    const duplicateCheck = await db.query(
      `SELECT title
           FROM jobs
           WHERE company_handle = $1`,
      [company_handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${title} at ${company_handle}`);

    const result = await db.query(
      `INSERT INTO jobs(
          title,
          salary,
          equity,
          company_handle)
           VALUES
             ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [
        title,
        salary,
        equity,
        company_handle,
      ],
    );
    const company = result.rows[0];

    return company;
  }

  /** Find all jobs, or all jobs passing filters.
   *
   * Returns [{ id, title, salary, equity, company_handle }, ...]
   * */

  static async findAll(filters = {}) {
    const { filterConditions, values } = createWhereSql(filters);

    const querySql = `
    SELECT id,
      title,
      salary,
      equity,
      company_handle AS "companyHandle"
    FROM jobs
    ${filterConditions}`;

    const jobsRes = await db.query(querySql, values);

    return jobsRes.rows;
  }

  /** Given an id, return data about job.
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id,
      title,
      salary,
      equity,
      company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
      [id]);

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      title : "title",
      salary : "salary",
      equity : "equity"
    });
    const idVarIdx = "$" + (values.length + 1);

    const validUpdateFields = ["title", "salary", "equity"]
    if (!Object.keys(data).some(key => validUpdateFields.includes(key))){
      throw new BadRequestError(`Can only update job title, salary and equity`)
    }

    const querySql = `
      UPDATE jobs
      SET ${setCols}
        WHERE id = ${idVarIdx}
        RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
      `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
      [handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }


  // Variable holding possible query strings which will be checked
  // Whatever in the query-string becomes filter for query
  //
}

module.exports = Job;