import { useState } from "react";

/** Form component used for searching jobs/companies
 * props: searchFor, handleSearch
 * state: formData
 */
function SearchForm({ searchFor, handleSearch }) {
  const initialState = (searchFor === "name") ? { name: "" } : { title: "" };
  const [formData, setFormData] = useState(initialState);

  /** Update form input. */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  }

  /** Call parent function. */
  function handleSubmit(evt) {
    evt.preventDefault();
    if (Object.values(formData)[0] === "") return;
    handleSearch(formData);
  }

  const formInputsHTML = (
    <div className="mb-3">
      <input
        id="search-form"
        name={searchFor}
        className="form-control form-search-input"
        placeholder="Enter search term.."
        onChange={handleChange}
        value={formData.searchFor}
        aria-label="search-form"
      />
    </div>
  );

  return (
    <form className="SearchForm my-3 d-flex d-inline justify-content-center" onSubmit={handleSubmit}>
      {formInputsHTML}
      <button className="SearchForm-Btn btn-primary btn ms-3 py-1 btn-med">
        Search
      </button>
    </form>
  );
}

export default SearchForm;
