import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api";
import JobsList from "../jobs/JobsList";
import LoadingSpinner from "../shared/LoadingSpinner";

/** Component for showing company details and list of Jobs
 * state: company {data, isLoading}
 */
function Company() {
  const { name } = useParams();
  const [company, setCompany] = useState({
    data: {},
    isLoading: true,
  });

  useEffect(
    function getCompany() {
      async function fetchCompanyFromAPI() {
        const companyResp = await JoblyApi.getCompany(name);
        setCompany(() => ({ data: { ...companyResp }, isLoading: false }));
      }
      if (company.isLoading) fetchCompanyFromAPI();
    },
    [company]
  );

  if (company.isLoading) return < LoadingSpinner />

  return (
    <div className="mt-5">
      <h1 style={{ color: "white", "textShadow": "#282c34 1px 1px" }}>
        {company.data.name}
      </h1>
      <p style={{ color: "white", "textShadow": "#282c34 1px 1px" }}>{company.data.description}</p>
      <JobsList jobs={company.data.jobs} />
    </div>
  );
}

export default Company;
