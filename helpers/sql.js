const { BadRequestError } = require("../expressError");

/**  Takes in data to be updated and columns to be updated as objects.
 * Returns object consisting of two arrays: columns and values  */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/** Takes in a filter object, turns keys into column names
 * and creates a set of conditions based on filters
 */
function createWhereSql(filters) {
  const possibleFilters = ["nameLike", "minEmployees", "maxEmployees"];
  let inputFilters = [];
  let values = [];
  let idx = 0;

  const keys = Object.keys(filters);
  if (keys.length === 0 || keys.some((key) => !possibleFilters.includes(key))) {
    throw new BadRequestError("No data");
  }

  //generate where conditions and add them to the inputFilters array
  if (keys.includes("maxEmployees")) {
    inputFilters.push(`num_employees <= $${idx + 1}`);
    values.push(filters["maxEmployees"]);
    idx++;
  }

  if (keys.includes("minEmployees")) {
    inputFilters.push(`num_employees >= $${idx + 1}`);
    values.push(filters["minEmployees"]);
    idx++;
  }

  if (keys.includes("nameLike")) {
    inputFilters.push(`name ILIKE '%$${idx + 1}%'`);
    values.push(filters["nameLike"]);
    idx++;
  }

  return {
    filterConditions: inputFilters.join(" AND "),
    values : values,
  };
}

module.exports = { sqlForPartialUpdate, createWhereSql };
