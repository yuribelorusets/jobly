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
  const keys = Object.keys(filters);

  if (keys.some((key) => !possibleFilters.includes(key))) {
    throw new BadRequestError("Invalid data: only nameLike, minEmployees, or maxEmployees allowed");
  }

  //generate where conditions and add them to the inputFilters array
  if (keys.includes("maxEmployees")) {
    values.push(filters["maxEmployees"]);
    inputFilters.push(`num_employees <= $${values.length}`);
  }

  if (keys.includes("minEmployees")) {
    values.push(filters["minEmployees"]);
    inputFilters.push(`num_employees >= $${values.length}`);
  }

  if (keys.includes("nameLike")) {
    values.push(`%${filters["nameLike"]}%`);
    inputFilters.push(`name ILIKE $${values.length}`);
  }
  
  let filterConditions = inputFilters.length > 0 ? "WHERE " + inputFilters.join(" AND ") : '';
  
  return {
    filterConditions,
    values
  };
}

module.exports = { sqlForPartialUpdate, createWhereSql };
