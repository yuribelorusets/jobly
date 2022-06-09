import { useState, useEffect } from "react";
import JoblyApi from "../api";
import SearchForm from "../shared/SearchForm";
import JobsList from "./JobsList";
import LoadingSpinner from "../shared/LoadingSpinner";

/** Jobs component handling page for Jobs
 *
 * state: jobs {jobsList, searchQuery, isLoading}
 * props: none
 */
function Jobs() {
  const [jobs, setJobs] = useState({
    jobsList: [],
    searchQuery: {},
    isLoading: true,
  });

  useEffect(
    function getJobs() {
      async function fetchJobsFromAPI() {
        const jobsResp = await JoblyApi.getJobs(
          jobs.searchQuery
        );
        setJobs((prevJobs) => ({
          ...prevJobs,
          jobsList: [...jobsResp],
          isLoading: false,
        }));
      }
      if (jobs.isLoading) fetchJobsFromAPI();
    },
    [jobs]
  );

  function handleSearch(queries) {
    setJobs((prevJobs) => ({
      ...prevJobs,
      searchQuery: { ...queries },
      isLoading: true,
    }));
  }

  if (jobs.isLoading) return < LoadingSpinner />

  return (
    <div className="pb-5">
      <SearchForm searchFor={"title"} handleSearch={handleSearch} />
      <JobsList jobs={jobs.jobsList} />
    </div>
  );
}

export default Jobs;
