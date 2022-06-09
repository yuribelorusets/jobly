import { useState, useEffect } from "react";
import JoblyApi from "../api";
import SearchForm from "../shared/SearchForm";
import CompaniesList from "./CompaniesList";
import LoadingSpinner from "../shared/LoadingSpinner";

/** Companies component handling page for Companies
 *
 * state: jobs {companiesList, searchQuery, isLoading}
 * props: none
 */
function Companies() {
  const [companies, setCompanies] = useState({
    companiesList: [],
    searchQuery: {},
    isLoading: true,
  });

  useEffect(
    function getCompanies() {
      async function fetchCompaniesFromAPI() {
        const companiesResp = await JoblyApi.getCompanies(
          companies.searchQuery
        );
        setCompanies((prevComp) => ({
          ...prevComp,
          companiesList: [...companiesResp],
          isLoading: false,
        }));
      }
      if (companies.isLoading) fetchCompaniesFromAPI();
    },
    [companies]
  );

  function handleSearch(queries) {
    setCompanies((prevComp) => ({
      ...prevComp,
      searchQuery: { ...queries },
      isLoading: true,
    }));
  }

  if (companies.isLoading) return < LoadingSpinner />

  return (
    <div className="pb-5">
      <SearchForm searchFor={"name"} handleSearch={handleSearch} />
      <CompaniesList companies={companies.companiesList} />
    </div>
  );
}

export default Companies;
